import urllib.request
import json

body = json.dumps({
    'name': 'Jane Smith',
    'email': 'jane.smith@test.com',
    'password': 'SecurePass123'
}).encode()

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/auth/register/',
    data=body,
    headers={'Content-Type': 'application/json'}
)

try:
    r = urllib.request.urlopen(req)
    print('Status:', r.status)
    print('Response:', r.read().decode())
except urllib.error.HTTPError as e:
    print('Status:', e.code)
    print('Response:', e.read().decode())
