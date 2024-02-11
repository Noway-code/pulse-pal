import os
import json
import fitz  # PyMuPDF
import xml.etree.ElementTree as ET
from docx import Document
import re
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import warnings

warnings.filterwarnings("ignore")


# Clean text function
def clean_text(text):
    text = re.sub(r"[^\w\s,.!?;:\'-]", "", text)
    text = re.sub(r"(\.{3,})", ".", text)  # Reduce sequences of dots
    text = re.sub(r"([!]{2,})", "!", text)
    text = re.sub(r"([?]{2,})", "?", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# Extract text from PDF
def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return clean_text(text)


# Extract text from XML
def extract_text_from_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    text = "".join(root.itertext())
    return clean_text(text)


# Extract text from JSON
def extract_text_from_json(file_path):
    with open(file_path, "r") as file:
        data = json.load(file)
        text = json.dumps(data)  # Convert JSON to string for cleaning
    return clean_text(text)


# Extract text from DOCX
def extract_text_from_docx(file_path):
    doc = Document(file_path)
    text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
    return clean_text(text)


# Extract text from TXT
def extract_text_from_txt(file_path):
    with open(file_path, "r") as file:
        text = file.read()
    return clean_text(text)


# Dispatcher to handle different file types
def extract_text(file_path):
    if not os.path.exists(file_path):
        print(f"File {file_path} does not exist.")
        return

    ext = os.path.splitext(file_path)[1].lower()
    try:
        if ext == ".pdf":
            return extract_text_from_pdf(file_path)
        elif ext == ".xml":
            return extract_text_from_xml(file_path)
        elif ext == ".json":
            return extract_text_from_json(file_path)
        elif ext == ".docx":
            return extract_text_from_docx(file_path)
        elif ext == ".txt":
            return extract_text_from_txt(file_path)
        else:
            print(f"Unsupported file format: {ext}")
            return ""
    except Exception as e:
        print(f"An error occurred while processing the file: {e}")
        return ""


def parse_document():
    # Assuming you're using the model 'biobart_radiology_summarization' or any other model name
    # Model checkpoint from Hugging Face
    model_checkpoint = "hamzamalik11/Biobart_radiology_summarization"

    # Load the model and tokenizer
    tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_checkpoint)

    # Create a summarization pipeline
    summarizer = pipeline("summarization", model=model, tokenizer=tokenizer)

    pdf_path = "uploaded-pdf.pdf"

    # Extract text from PDF
    report_text = extract_text(pdf_path)

    if report_text:
        # Summarize the report
        output = summarizer(report_text, max_length=130, min_length=30)
        print("\nSummary:")
        print(output[0]["summary_text"])

        return output[0]["summary_text"]
    else:
        print("Failed to extract text or file is not supported.")
