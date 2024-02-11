from ast import parse
import sys
import argparse


try:
    from PyQt5.QtWidgets import QApplication
except ImportError:
    import sys

    QApplication = [sys.__package__ + ".QApplication"]

from yarppg.yarppg.rppg.camera import Camera
from yarppg.yarppg.rppg import RPPG
from yarppg.yarppg.rppg.processors import ColorMeanProcessor, FilteredProcessor
from yarppg.yarppg.rppg.hr import HRCalculator
from yarppg.yarppg.rppg.filters import get_butterworth_filter
from yarppg.yarppg.ui.cli import (
    get_detector,
    get_mainparser,
    get_processor,
    parse_frequencies,
    get_delay,
)


def get_data(path: str, fps=30):
    print("Getting data")
    parser = get_mainparser()
    args = parser.parse_args([])
    app = QApplication(sys.argv)
    print(app)

    roi_detector = get_detector(args)

    digital_lowpass = get_butterworth_filter(30, 1.5)
    hr_calc = HRCalculator(
        parent=app,
        update_interval=30,
        winsize=None,
        filt_fun=lambda vs: [digital_lowpass(v) for v in vs],
    )

    processor = get_processor(args)

    cutoff = parse_frequencies(args.bandpass)
    if cutoff is not None:
        digital_bandpass = get_butterworth_filter(30, cutoff, "bandpass")
        processor = FilteredProcessor(processor, digital_bandpass)

    cam = Camera(video=path, limit_fps=fps)
    rppg = RPPG(
        roi_detector=roi_detector,
        camera=cam,
        hr_calculator=hr_calc,
        parent=None,
        app=app,
    )
    rppg.add_processor(processor)
    for c in "rgb":
        rppg.add_processor(ColorMeanProcessor(channel=c, winsize=1))

    if args.savepath:
        rppg.output_filename = args.savepath

    rppg.start()
    app.exec_()

    series = []

    vs = list(rppg.rppg_updated.vs_iter(None))[0]

    ts = rppg.get_ts(None)

    for i in range(len(vs)):
        series.append((ts[i], vs[i]))

    return series


if __name__ == "__main__":
    sys.exit(get_data("movtest.mov", 30.45))
