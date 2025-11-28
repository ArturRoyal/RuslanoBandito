import requests

# replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SXR8.DEX&apikey=D455JCEO99F3A1OF'
# url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SXR8.DEX&outputsize=full&apikey=D455JCEO99F3A1OF'

# url = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=SXR8.DEX&apikey=QJ3OHFW9EIW6MV4R'

r = requests.get(url)
data = r.json()

print(data)