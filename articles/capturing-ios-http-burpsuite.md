---
title: "Capturing iOS Application’s HTTP Traffic using Burp Suite"
date: "April 02, 2021"
description: "Guide on capturing HTTP traffic from iOS applications using Burp Suite."
---

Capturing and analyzing HTTP traffic is crucial for mobile testing and cybersecurity. Burp Suite is a powerful tool that can help you intercept and inspect HTTP traffic from iOS applications. Follow the steps below to set up Burp Suite for capturing HTTP traffic on your iOS device.

### Step-by-Step Guide

1. **Install Burp Suite**: Download and install Burp Suite from the official website.

2. **Configure Burp Suite**:
   - Open Burp Suite and navigate to the Proxy tab.
   - Click on the "Options" tab and set the interface to listen on 127.0.0.1:8080 (or your preferred port).

3. **Set up Proxy on iOS Device**:
   - Go to **Settings > Wi-Fi** and select the connected Wi-Fi network.
   - Scroll down and tap **Configure Proxy**.
   - Select **Manual** and enter the IP address of the machine running Burp Suite and the port number (e.g., 8080).

4. **Install Burp Suite Certificate on iOS**:
   - Open Safari on your iOS device and go to http://burpsuite
   - Download the CA certificate.
   - Go to **Settings > General > Profiles** and install the certificate.
   - Enable the certificate via **Settings > General > About > Certificate Trust Settings**.

### Note
In case you are unable to connect with the proxy, turn off your antivirus software and allow the firewall to access Burp Suite on the local network. For iOS latest versions, you will be asked to "review the profile in settings app" when you go to install the certificate.


