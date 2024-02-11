import neurokit2 as nk
import pandas as pd
import numpy as np
import warnings
import cv2
import heartpy as hp


def get_fps(video_path):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.release()
    return fps


def process_raw_data(raw_ppg, fps):
    # Get y-values from raw ppg data
    ppg_signal = np.array([x[1] for x in raw_ppg if abs(x[1]) < 1])
    print("pp signal")
    print(ppg_signal.tolist())
    print()
    sampling_rate = 1000 / fps
    working_data, measures = hp.process(
        ppg_signal, sampling_rate, bpmmin=0, bpmmax=200, calc_freq=True
    )

    print("working data")
    print(working_data)
    print()
    print("measures")
    print(measures)

    print(type(measures["sdsd"]))

    sdsd = measures["sdsd"]

    if isinstance(sdsd, np.ma.core.MaskedConstant):
        sdsd = np.nan

    ret = {
        "HR": measures["bpm"],
        "SDNN": measures["sdnn"],
        "RMSSD": measures["rmssd"],
        "SDSD": sdsd,
        "PNN50": measures["pnn50"],
        "SD1": measures["sd1"],
        "SD2": measures["sd2"],
    }

    return ret


# warnings.filterwarnings("ignore")


# def process_ppg_data(ppg_signal, sampling_rate):
#     """
#     Process PPG signal to extract HRV metrics.

#     Parameters:
#     - ppg_signal: The PPG signal data as a list or a pandas Series.
#     - sampling_rate: The sampling rate of the PPG signal in Hz.

#     Returns:
#     - A dictionary containing the HRV metrics.
#     """

#     # Clean the PPG signal
#     cleaned_ppg = nk.ppg_clean(ppg_signal, sampling_rate=sampling_rate)

#     # Find peaks in the PPG signal
#     signals, info = nk.ppg_process(cleaned_ppg, sampling_rate=sampling_rate)

#     # Compute HRV indices using the detected peaks
#     hrv_metrics = nk.hrv(
#         info, sampling_rate=sampling_rate, show=False, scale=[len(ppg_signal)]
#     )

#     # Calculate heart rate
#     # Extract R-peak locations
#     rpeak_locations = info["PPG_Peaks"]
#     # Calculate intervals (RR) in seconds
#     rr_intervals = np.diff(np.where(rpeak_locations)[0]) / sampling_rate
#     # Calculate heart rate
#     heart_rate = 60 / np.mean(rr_intervals)

#     # Extract desired metrics and SDNN
#     desired_metrics = {
#         "HR": heart_rate,
#         "MEAN_RR": hrv_metrics["HRV_MeanNN"].values[0],
#         "MEDIAN_RR": hrv_metrics["HRV_MedianNN"].values[0],
#         "SDNN": hrv_metrics["HRV_SDNN"].values[0],
#         "RMSSD": hrv_metrics["HRV_RMSSD"].values[0],
#         "SDSD": hrv_metrics["HRV_SDSD"].values[0],
#         "pNN50": hrv_metrics["HRV_pNN50"].values[0],
#         "SD1": hrv_metrics["HRV_SD1"].values[0],
#         "SD2": hrv_metrics["HRV_SD2"].values[0],
#     }

#     # Set SDNN value to a variable as a floating point
#     sdnn_value = float(desired_metrics["SDNN"])

#     # Optionally, return SDNN value if needed elsewhere
#     return desired_metrics, sdnn_value


# def analyze_sdnn(sdnn_value):
#     """
#     Analyzes the SDNN value and returns a string analysis and a severity level.

#     Parameters:
#     - sdnn_value: The SDNN value as a floating-point number.

#     Returns:
#     - A tuple containing a string with the analysis based on the SDNN value and a string indicating the severity level.
#     """
#     if sdnn_value >= 100:
#         analysis = "A high HRV value, indicative of good heart rate variability (HRV), reflects a well-balanced and responsive autonomic nervous system, crucial for cardiovascular health. This greater variability between heartbeats signifies an efficient stress response, reduced systemic inflammation, and optimal autonomic balance between the sympathetic and parasympathetic branches. Research suggests that individuals with higher HRV have a significantly lower risk of cardiovascular events, hypertension, and related health issues, potentially reducing these risks by notable percentages. The precise risk reduction can vary based on individual and demographic factors, but the overall consensus underscores the importance of a high HRV as a marker of cardiovascular resilience and health. Promoting lifestyle changes that enhance HRV can therefore be a key strategy in preventing cardiovascular diseases and improving long-term health outcomes. Good job!"
#         severity = "none"
#     elif sdnn_value < 50:
#         analysis = "A low HRV value, indicating poor heart rate variability (HRV), suggests a less responsive autonomic nervous system, often associated with higher stress levels, reduced cardiovascular fitness, and an increased risk of cardiovascular diseases. This diminished variability signifies a potential imbalance in the autonomic nervous system, with either excessive sympathetic dominance (stress response) or insufficient parasympathetic activity (relaxation response). Individuals with low HRV are at a heightened risk for hypertension, heart attacks, and stroke due to this autonomic imbalance and its effects on heart rate, blood pressure, and inflammation. To improve HRV, individuals should focus on stress reduction techniques such as mindfulness meditation, deep breathing exercises, and yoga. Regular physical activity, especially aerobic exercises like walking, cycling, or swimming, can also enhance autonomic balance by strengthening the heart and improving its efficiency. Additionally, ensuring adequate sleep, adopting a heart-healthy diet rich in omega-3 fatty acids, and avoiding tobacco and excessive alcohol consumption are crucial lifestyle adjustments that can help increase HRV and reduce cardiovascular risks."
#         severity = "high"
#     else:
#         analysis = "A moderate HRV value represents a heart rate variability (HRV) that falls between high and low ranges, indicating a relatively balanced autonomic nervous system but with room for improvement in stress management and cardiovascular health. While not at as high risk as those with low HRV, individuals with moderate HRV could still benefit from enhancing their autonomic flexibility to further reduce their risk of cardiovascular issues and improve overall well-being. To elevate HRV from a moderate to a higher level, individuals should focus on regular engagement in both aerobic and resistance training exercises to improve cardiovascular fitness and autonomic balance. Incorporating relaxation and stress management practices, such as progressive muscle relaxation, biofeedback, or engaging in hobbies and activities that promote joy and relaxation, can also be beneficial. Dietary strategies, including the reduction of caffeine and processed foods intake while increasing antioxidant-rich fruits and vegetables, can support autonomic health. Finally, maintaining a consistent sleep schedule and ensuring quality sleep can also play a significant role in improving HRV and achieving a healthier, more resilient cardiovascular system."
#         severity = "medium"

#     return analysis, severity


# def test_process(raw_ppg, fps):
#     sampling_rate = 1000 / fps

#     f_sig = biobss.preprocess.filter_signal(
#         sig,
#         sampling_rate=sampling_rate,
#         filter_type="bandpass",
#         N=2,
#         f_lower=0.5,
#         f_upper=5,
#     )


# def process_raw_data(raw_ppg, fps):
#     print("testtest")
#     ppg_signal = [x[1] for x in raw_ppg if abs(x[1]) < 1]

#     print(f"PPG Signal: {ppg_signal}")

#     sampling_rate = 1000 / fps

#     hrv_metrics, sdnn_value = process_ppg_data(ppg_signal, sampling_rate)

#     # Analyze SDNN
#     sdnn_analysis, severity = analyze_sdnn(sdnn_value)

#     print(severity)
#     # Display the HRV metrics and the analysis
#     print("HRV Metrics:")
#     print(pd.DataFrame([hrv_metrics]))
#     print(f"\nSDNN Analysis: {sdnn_analysis}")
#     print("Remember that a good HRV can reduce risk of cardiovascular events by 10%!")
#     print("HRV Metrics:")
#     print(hrv_metrics)
#     return hrv_metrics
