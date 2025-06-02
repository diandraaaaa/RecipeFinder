import requests
r = requests.post("http://localhost:8000/recommend", json={"ingredients": ["tomato", "basil", "mozzarella"]})
print(r.json())
