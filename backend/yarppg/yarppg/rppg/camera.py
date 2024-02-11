import time

import cv2
import numpy as np

try:
    from PyQt5.QtCore import QThread
except:
    import sys

    QThread = [sys.__package__ + ".QThread"]

from PyQt5.QtCore import pyqtSignal


class Camera(QThread):
    """Wraps cv2.VideoCapture and emits Qt signals with frames in RGB format.

    The :py:`run` function launches a loop that waits for new frames in
    the VideoCapture and emits them with a `new_frame` signal.  Calling
    :py:`stop` stops the loop and releases the camera.
    """

    frame_received = pyqtSignal(np.ndarray)

    def __init__(self, video=0, parent=None, limit_fps=None):
        """Initialize Camera instance

        Args:
            video (int or string): ID of camera or video filename
            parent (QObject): parent object in Qt context
            limit_fps (float): force FPS limit, delay read if necessary.
        """

        QThread.__init__(self, parent=parent)
        self._cap = cv2.VideoCapture(video)
        self._running = False
        self._delay = 1 / limit_fps - 0.012 if limit_fps else np.nan
        self.fps = limit_fps
        # subtracting a roughly constant delay of 12ms TODO: better way?
        # np.nan will always evaluate to False in a comparison

    def run(self):
        self._running = True
        while self._running:
            ret, frame = self._cap.read()
            last_time = time.perf_counter()

            if not ret:
                self._running = False
                self.frame_received.emit(np.ndarray((0, 0, 0)))
                # raise RuntimeError("No frame received")
            else:
                self.frame_received.emit(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            while (time.perf_counter() - last_time) < self._delay:
                # time.sleep(0.001)
                break

    def stop(self):
        self._running = False
        # time.sleep(0.1)
        self._cap.release()
