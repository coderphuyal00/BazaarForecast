# import sys
# sys.path.append('.\Data_Handling\index_data.py/index_data')
import requests
from datetime import datetime,timezone
from datetime import timedelta
def getIndexData(index):
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
    url=f'https://merolagani.com/handlers/TechnicalChartHandler.ashx?type=get_advanced_chart&symbol={index}&resolution=1M&rangeStartDate={start_of_month_epoch_time}&rangeEndDate={today_epoch_time}&from=&isAdjust=1&currencyCode=NPR"'
    response=requests.get(url)
    
    if response.status_code ==200:
        data=response.json()
        required_data={
            'index':index,
            'date':data['t'],
            'close_price':data['c']
        }
        records = [
    {'index':required_data['index'],'date': datetime.fromtimestamp(date, tz=timezone.utc).strftime('%Y-%m-%d'), 'close_price': price} 
    for date, price in zip(required_data['date'], required_data['close_price'])
]

    return records

