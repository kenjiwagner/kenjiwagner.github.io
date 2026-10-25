---
title: Multimodal Skin Cancer Detection
summary: A detection pipeline that fuses Vision Transformers on lesion images with XGBoost on tabular patient data, reaching 92.99% accuracy and 0.8907 AUROC.
tags: [Deep Learning, PyTorch, TensorFlow, XGBoost, OpenCV]
period: Oct 2024 – Dec 2024
date: 2024-12-01
featured: true
highlights:
  - 92.99% accuracy and 0.8907 AUROC
  - Led the fusion design and evaluation
  - Addressed data leakage and class imbalance
---

A multimodal model for skin cancer detection. Lesion images go through a **Vision Transformer**, tabular patient features go through **XGBoost**, and the two are fused into one prediction.

I led the fusion design and the evaluation. That meant guarding against data leakage between splits and handling heavy class imbalance, which are the two problems that most often inflate medical-imaging results.

**Stack:** Python, PyTorch, TensorFlow, Scikit-Learn, OpenCV
