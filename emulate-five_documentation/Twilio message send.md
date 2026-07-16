# Twilio Message Send Notes

This note documents the exact Twilio API calls used for sending, listing, deleting, verifying, and placing calls in the local emulator.

## Send a Message

```bash
curl -X POST   http://localhost:4013/2010-04-01/Accounts/AC00000000000000000000000000000000/Messages.json   -u AC00000000000000000000000000000000:twilio_test_auth_token   --data-urlencode "From=+15551234567"   --data-urlencode "To=+15557654321"   --data-urlencode "Body=Hola Como estas? el soy nixhal"
```

## Delete a Message

```bash
curl -X DELETE \
http://localhost:4013/2010-04-01/Accounts/AC00000000000000000000000000000000/Messages/SMXXXXXXXXXXXXXXXX.json \
-u AC00000000000000000000000000000000:twilio_test_auth_token
```

Note: replace `smxxxxx` with the real SID, which is present in the message section:

`SMc2bf9eac660a90fd3adbab537726746d`

## List Messages

```bash
curl -X GET \
http://localhost:4013/2010-04-01/Accounts/AC00000000000000000000000000000000/Messages.json \
-u AC00000000000000000000000000000000:twilio_test_auth_token
```

## Create a Verification

```bash
curl -X POST \
http://localhost:4013/verify/v2/Services/VA00000000000000000000000000000000/Verifications \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
-d "To=%2B15557654321" \
-d "Channel=sms"
```

### Important Note

The number must be the same, for example `+15551234567`.

## Send a Call Request

```bash
curl -X POST \
http://localhost:4013/2010-04-01/Accounts/AC00000000000000000000000000000000/Calls.json \
-u AC00000000000000000000000000000000:twilio_test_auth_token \
--data-urlencode "From=+15551234567" \
--data-urlencode "To=+15557654321" \
--data-urlencode "Url=http://demo.twilio.com/docs/voice.xml"
```

