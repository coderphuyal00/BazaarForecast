import numpy as np
import pandas as pd
import os
import requests
from datetime import datetime
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
# import matplotlib.pyplot as plt

current_time=datetime.now()
def epochConverter(currentTime,format_str="%Y-%m-%d %H:%M:%S"):
        formatted_time = currentTime.strftime("%Y-%m-%d %H:%M:%S")
        # dt = currentTime.strptime(currentTime,format_str)
        parsed_time = datetime.strptime(formatted_time, "%Y-%m-%d %H:%M:%S")
        epoch_ms = int(parsed_time.timestamp() * 1000)
        return epoch_ms

today_epoch_timestamp=epochConverter(current_time)
def predict_stock_price(symbol):
   try:
      # url=f'https://raw.githubusercontent.com/Aabishkar2/nepse-data/refs/heads/main/data/company-wise/{symbol}.csv'
      # data = pd.read_csv(url)
      # # Replace with your data source
      # close_prices = data['close'].values  # Assuming 'Close' is the column name
      url=f'https://www.nepalipaisa.com/api/GetStockDataForChart?stockSymbol={symbol}&dataType=1Y&_={today_epoch_timestamp}'
   # response=requests.get(url)
      response=requests.get(url)
      close_prices = np.array([])

# Check API response
      if response.status_code == 200:
         try:
            data = response.json()
            result = data['result']  # Ensure 'result' key exists
            # Collect closing prices
            for price in result:
                  close_price = price['closingPrice']  # Ensure 'closingPrice' key exists
                  close_prices = np.append(close_prices, round(close_price,2))  # Convert to float and assign back
            # Normalize the data if close_prices is not empty
            if len(close_prices) > 0:
                  scaler = MinMaxScaler(feature_range=(0, 1))
                  scaled_data = scaler.fit_transform(close_prices.reshape(-1, 1))
                  # Create sequences of data for training
                  def create_dataset(data, time_step=1):
                        X, y = [], []
                        for i in range(len(data) - time_step - 1):
                           X.append(data[i:(i + time_step), 0])
                           y.append(data[i + time_step, 0])
                        return np.array(X), np.array(y)

                  time_step = 60  # Use the past 60 days to predict the next day
                  X, y = create_dataset(scaled_data, time_step)

                     # Reshape X to be [samples, time steps, features]
                  X = X.reshape(X.shape[0], X.shape[1], 1)

                  model = Sequential()
                  model.add(LSTM(50, return_sequences=True, input_shape=(X.shape[1], 1)))
                  model.add(Dropout(0.2))
                  model.add(LSTM(50, return_sequences=False))
                  model.add(Dropout(0.2))
                  model.add(Dense(25))
                  model.add(Dense(1))  # Output layer

                  model.compile(optimizer='adam', loss='mean_squared_error')
                  model.fit(X, y, batch_size=32, epochs=10)  # Adjust epochs and batch_size as needed
                     
                  # Get the last time_step days of data for prediction
                  last_days = scaled_data[-time_step:]  # Get the last time_step days
                  last_days = last_days.reshape((1, time_step, 1))  # Reshape for LSTM input

                  # Predict for 7 days

                  # predictions = []
                  # for _ in range(7):  # Predict for the next 7 days
                  #    predicted_price = model.predict(last_days)  # Get the prediction
                  #    predictions.append(predicted_price[0][0])  # Store the predicted price

                  #    # Update last_days with the new predicted price for the next iteration
                  #    predicted_price_reshaped = predicted_price.reshape(1, 1, 1)
                  #    last_days = np.append(last_days[:, 1:, :], predicted_price_reshaped, axis=1)

                  # # Inverse transform to get actual prices
                  # predicted_prices = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))

                  # # Display predicted prices for the next week
                  # print("Predicted Prices for the Next Week:")
                  # print(predicted_prices)

                  # predict for next day ie one day
                  predicted_price_scaled = model.predict(last_days)
                  # Convert back to original scale
                  predicted_price = scaler.inverse_transform(predicted_price_scaled)

                  # Round to 2 decimal places for clean output
                  predicted_price = round(predicted_price[0][0], 2)

                  print("Predicted Price for Next Day:", predicted_price)
                  return predicted_price
                  # return predicted_prices
                  # print(predicted_price)
                  # return predicted_price
            else:
                  print("Error: No closing prices found in the response.")
         except KeyError as e:
            print(f"Error: Missing key in JSON response - {e}")
         except ValueError as e:
            print(f"Error: Invalid data format - {e}")
      else:
         print(f"Error: API request failed with status code {response.status_code}")
         
   except Exception as e:
        print(f"Error predicting for {symbol}: {e}")
        return None


   
