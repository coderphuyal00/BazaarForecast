# import sys
# sys.path.append('.\Data_Handling\index_data.py/index_data')
import requests
from datetime import datetime,timezone
from datetime import timedelta
def getStockPrice(stock,resolution):
    current_time=datetime.now()
    current_month_start_date= current_time - timedelta(days= 29)
    def epochConverter(currentTime):
        formatted_time = currentTime.strftime("%Y-%m-%d %H:%M:%S")
        parsed_time = datetime.strptime(formatted_time, "%Y-%m-%d %H:%M:%S")
        epoch_time = parsed_time.timestamp()
        return int(epoch_time)
    today_epoch_time=epochConverter(current_time)
    start_of_month_epoch_time=epochConverter(current_month_start_date)
    today_date=current_time.strftime("%Y-%m-%d")
    url=f'https://merolagani.com/handlers/TechnicalChartHandler.ashx?type=get_advanced_chart&symbol={stock}&resolution={resolution}&rangeStartDate={start_of_month_epoch_time}&rangeEndDate={today_epoch_time}&from=&isAdjust=1&currencyCode=NPR"'
    response=requests.get(url)
    
    if response.status_code ==200:
        data=response.json()
        required_data={
            'stock':stock,
            'date':data['t'],
            'high_price':data['h'],
            'low_price':data['l'],
            'close_price':data['c'],
            'open_price':data['o'],
            'volume':data['v']
        }
        records = [
    {'stock':required_data['stock'],'date': datetime.fromtimestamp(date, tz=timezone.utc).strftime('%Y-%m-%d'), 'close_price': close_price, 'high_price': high_price, 'low_price': low_price, 'open_price': open_price, 'volume': volume} 
    for date, close_price ,high_price,low_price,open_price,volume in zip(required_data['date'], required_data['close_price'],required_data['high_price'],required_data['low_price'],required_data['open_price'],required_data['volume'])
]

    return records

