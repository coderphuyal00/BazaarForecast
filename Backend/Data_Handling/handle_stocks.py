import pandas as pd
from Stocks.models import Stock,StockTechnicalDetails
from decimal import Decimal,InvalidOperation
from datetime import date

def clean_number(value, number_type='int'):
        if value is None:
            return None
        try:
            value = str(value).replace(',', '').strip()
            if value == '':
                return None
            if number_type == 'int':
                return int(value)
            elif number_type == 'decimal':
                return Decimal(value)
            else:
                raise ValueError("number_type must be 'int' or 'decimal'")
        except (ValueError, InvalidOperation, AttributeError):
            return None
        
def store_company_data():
    df=pd.read_csv("./Data_Handling/Collections/Fundamental_Details/2025-06-05.csv")
    print(df)
    
    
    
        
    for _, row in df.iterrows():
        row.replace('""',"")
        # symbol=row['Symbol']
        # name=row['Company Name']
        # sector=row['Sector']
        # market_capital=row['Market Cap']
        # eps=row['EPS']
        # pe_ratio=row[r'P/E Ratio']
        # dividend=row['Recent Dividend']
        # bvps=row['BVPS']
        # paid_capital=row['Paid Up Capital']
        # year_yield=row['1 Year Price Change']
        # last_updated='2025-06-26'
        # listed_share=row['Share Outstanding']

        stock, created=Stock.objects.get_or_create(
            ticker=row['Symbol'],
            defaults={
                'name': row['Company Name'],
                'sector': row['Sector'],
                'market_cap': clean_number(row['Market Cap'],'decimal'),
                'eps': row['EPS'],
                'pe_ratio': clean_number(row[r'P/E Ratio'],'decimal'),
                'dividend': '-',
                'bvps': clean_number(row['BVPS'],'decimal'),
                'paid_capital': clean_number(row['Paid Up Capital'],'decimal'),
                'listed_share': clean_number(row['Share Outstanding'], 'decimal'),
                'year_yield': clean_number(row['1 Year Price Change'], 'int'),
                'last_updated':'2025-07-28'
            }
            
        )


def update_company_yearyield_data():
    df=pd.read_csv("./Data_Handling/Collections/Fundamental_Details/2025-06-05.csv")
    
    def remove_percentage(value):
        if value is None:
            return None
        try:
            value=str(value).replace('%','').strip()
            modified_value=int(value)
        except(ValueError):
            return None   
        return clean_number(modified_value,'int')
    
    for _, row in df.iterrows():
        row.replace('""',"")
        stock, created=Stock.objects.update_or_create(
            ticker=row['Symbol'],
            defaults={
               'year_yield': remove_percentage(row['1 Year Price Change']),

            }
        )
def update_company_data():
    df=pd.read_csv('./Data_Handling/Collections/Fundamental_Details/2025-06-29_remaining_symbols_details.csv')
    
    def remove_percentage(value):
        if value is None:
            return None
        try:
            value=str(value).replace('%','').strip()
            modified_value=int(value)
        except(ValueError):
            return None   
        return modified_value
    
    for _, row in df.iterrows():
        row.replace('""',"")
        stock, created=Stock.objects.update_or_create(
            ticker=row['Company Symbol'],
            defaults={
                'pe_ratio': clean_number(row[r'P/E Ratio'],'decimal'),
                'bvps': clean_number(row['BVP'],'decimal')

            }
        )

# upload_company_data()
def upload_daily_price():
    df=pd.read_csv('./Data_Handling/Collections/Daily_Data/2025-07-31.csv')
    for _, row in df.iterrows():
        row.replace('""',"")
        get_stock=Stock.objects.get(ticker=f'{row['Symbol']}')
        # symbol=row['Symbol']
        # name=row['Company Name']
        # sector=row['Sector']
        # market_capital=row['Market Cap']
        # eps=row['EPS']
        # pe_ratio=row[r'P/E Ratio']
        # dividend=row['Recent Dividend']
        # bvps=row['BVPS']
        # paid_capital=row['Paid Up Capital']
        # year_yield=row['1 Year Price Change']
        # last_updated='2025-06-26'
        # listed_share=row['Share Outstanding']
        record_date = date(2025, 7, 3) # today's date
        stock_daily_data, created=StockTechnicalDetails.objects.get_or_create(
            # stock=stock_id.id,
            stock=get_stock,
            date=record_date,
            defaults={
                'date': row['Transaction Date'],
                'open_price': clean_number(row['Open'],'decimal'),
                'high_price': clean_number(row['High'],'decimal'),
                'low_price': clean_number(row['Low'],'decimal'),
                'close_price': clean_number(row['Close'],'decimal'),
                'high_price_52_week': clean_number(row['52 Weeks High'],'decimal'),
                'low_price_52_week': clean_number(row['52 Weeks Low'],'decimal'),
                'volume': clean_number(row['Vol'],'decimal'),
                'sentiment_score':clean_number(row['Sentiment Score'])
            }
        )

# update daily data
def update_daily_price():
    df=pd.read_csv('./Data_Collections/Daily Data/2025-07-03.csv')
    for _, row in df.iterrows():
        row.replace('""',"")
        get_stock=Stock.objects.get(ticker=f'{row['Symbol']}')
        # symbol=row['Symbol']
        # name=row['Company Name']
        # sector=row['Sector']
        # market_capital=row['Market Cap']
        # eps=row['EPS']
        # pe_ratio=row[r'P/E Ratio']
        # dividend=row['Recent Dividend']
        # bvps=row['BVPS']
        # paid_capital=row['Paid Up Capital']
        # year_yield=row['1 Year Price Change']
        # last_updated='2025-06-26'
        # listed_share=row['Share Outstanding']
        record_date = date(2025, 7, 3) # today's date
        stock_daily_data, updated=StockTechnicalDetails.objects.update_or_create(
            # stock=stock_id.id,
            stock=get_stock,
            date=record_date,
            defaults={                
                'volume': clean_number(row['Vol'],'decimal')
            }
        )