# mentor-ai

Testing OAuth callback requires Ngrok, to use Ngrok install by doing the following:
```
brew install ngrok/ngrok/ngrok
```
Then go to the Ngrok website using the Mentor AI Google account and add the auth token:
```
ngrok config add-authtoken <auth token>
```
Deploy to a static domain like this:
```
ngrok http --domain=amused-javelin-dynamic.ngrok-free.app 80
```
