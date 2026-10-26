---
title: Dairy Queen Seasonal Forecasting
summary: Seasonal time-series models of U.S. search interest in Dairy Queen (2009–2019). auto.arima won the holdout at 6.99% MAPE.
tags: [Time Series, R, Forecasting, ggplot2]
period: Apr 2025 – May 2025
date: 2025-05-15
featured: false
repo: kenjiwagner/dairyqueenseasonaltimeseriesproject
highlights:
  - Captured a strong summer peak and a long-term upward trend
  - Compared hand-tuned SARIMA, auto.arima, and Holt-Winters on a 2018–2019 holdout
  - Best model was auto.arima, at 6.99% MAPE
---

Monthly Google search interest in Dairy Queen from 2009 to 2019, modeled as a seasonal time series in R.

I tuned SARIMA models by hand using ACF/PACF plots and AICc, then compared them with `auto.arima` and Holt-Winters on a 2018–2019 holdout. `auto.arima` forecast most accurately, at **6.99% MAPE**.

**Stack:** R, forecast, ggplot2
