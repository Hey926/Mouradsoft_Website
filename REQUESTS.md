# Free launch access requests

The pre-registration button opens a visitor's email app with a request addressed to
`mouradcrosoft@outlook.com`. The visitor must send that email. It asks you to send
their launch access file when Mubuntu launches; no email or access file is sent
automatically, and no registration form is used.

Start the small server on your computer from this folder:

```powershell
node request-server.cjs
```

Open `http://127.0.0.1:8080/coming-soon.html`. The button checks `/api/presence`
every 15 seconds and again before opening an email. Stopping the server with
Ctrl+C closes requests. Online means this process is running and reachable;
it does not detect whether you are sitting at your computer.

For public visitors, the server must be reachable through a public HTTPS address,
for example an HTTPS tunnel to port 8080 on this computer. Localhost is only a
local preview. If your public website is hosted separately, set
`data-presence-url` on `pre-register-button` in `coming-soon.html` to the server's
public HTTPS `/api/presence` URL. That endpoint allows cross-origin status checks.
Do not point it to localhost on the public site: that would check the visitor's
computer. Without a reachable endpoint, requests stay closed.

Keep the public website on a separate static host if you want it to remain
available while this computer is off. Do not deploy the presence server to an
always-on host: its availability is what signals your computer is online.

This controls the website button. Visitors who already know the email address
can still send email directly while you are offline.
