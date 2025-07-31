# MindWell - Mental Health Companion

A professional mental health wellness application that provides daily mental health tips, inspirational quotes, mood tracking, and mental health resources. Built with vanilla HTML, CSS, and JavaScript with a beautiful Golden Horizon color scheme.

## Features

- **Daily Dashboard**: Get daily mental health tips and mood overview
- **Inspirational Quotes**: Fetch motivational quotes from external API with category filtering
- **Mood Tracker**: Track daily moods with notes and view history
- **Mental Health Resources**: Access to crisis support and professional resources
- **Breathing Exercises**: Guided breathing exercises for stress relief
- **Responsive Design**: Works on all devices with professional UI

## APIs Used

- **Quotable API** (https://quotable.io): For fetching inspirational and motivational quotes
  - Endpoints: `/random`, `/random?tags={category}`
  - No API key required
  - Rate limit: 180 requests per minute

## Local Development

### Prerequisites
- Modern web browser
- Local web server (optional, can run directly in browser)

### Running Locally
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Or serve using a local server:
   \`\`\`bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js
   npx serve -p 8080
   \`\`\`

## Docker Deployment

### Building the Image
\`\`\`bash
# Build the Docker image
docker build -t your-dockerhub-username/mindwell:v1 .

# Test locally
docker run -p 8080:8080 your-dockerhub-username/mindwell:v1

# Verify it works
curl http://localhost:8091
\`\`\`

### Pushing to Docker Hub
\`\`\`bash
# Login to Docker Hub
docker login

# Push the image
docker push your-dockerhub-username/mindwell:v1

# Tag as latest
docker tag your-dockerhub-username/mindwell:v1 your-dockerhub-username/mindwell:latest
docker push your-dockerhub-username/mindwell:latest
\`\`\`

### Deployment on Lab Servers

#### Step 1: Deploy on Web01 and Web02
SSH into each server and run:
\`\`\`bash
# Pull the image
docker pull your-dockerhub-username/mindwell:v1

# Run the container
docker run -d --name mindwell-app --restart unless-stopped \
  -p 8080:8080 your-dockerhub-username/mindwell:v1

# Verify it's running
curl http://localhost:8091
\`\`\`

#### Step 2: Configure Load Balancer (HAProxy on lb-01)
Update `/etc/haproxy/haproxy.cfg`:
\`\`\`
global
    daemon

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend mindwell_frontend
    bind *:80
    default_backend mindwell_servers

backend mindwell_servers
    balance roundrobin
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
\`\`\`

Reload HAProxy:
\`\`\`bash
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'
\`\`\`

#### Step 3: Testing Load Balancing
\`\`\`bash
# Test multiple requests to see round-robin in action
for i in {1..6}; do
  echo "Request $i:"
  curl -s http://localhost | grep -o '<title>.*</title>'
  sleep 1
done
\`\`\`

## Architecture

\`\`\`
Internet → Load Balancer (lb-01:80) → Web01:8080
                                   → Web02:8080
\`\`\`

## Security Considerations

- No sensitive API keys required (Quotable API is free and open)
- All data stored locally in browser localStorage
- HTTPS headers configured in nginx
- Content Security Policy implemented
- XSS protection enabled

## Performance Features

- Lightweight vanilla JavaScript (no frameworks)
- Responsive CSS Grid and Flexbox layouts
- Efficient API caching
- Optimized images and assets
- Service Worker ready for PWA conversion

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Data Storage

All user data (mood entries, preferences) is stored locally in the browser's localStorage. No personal data is transmitted to external servers except for API requests to fetch quotes.

## Contributing

This application serves as a mental health support tool and should be used alongside professional medical advice when needed. The crisis resources provided are for emergency situations.

## License

This project is for educational purposes. Please ensure proper attribution when using external APIs and resources.

## Troubleshooting

### Common Issues

1. **Quotes not loading**: Check internet connection and API availability
2. **Mood data lost**: Ensure localStorage is enabled in browser
3. **Responsive issues**: Clear browser cache and reload

### Docker Issues

1. **Port conflicts**: Ensure port 8080 is available
2. **Image not found**: Verify Docker Hub repository name
3. **Container won't start**: Check nginx configuration syntax

## Future Enhancements

- User authentication system
- Data export functionality
- More detailed mood analytics
- Integration with wearable devices
- Offline functionality with Service Workers
- Multi-language support

---

**Disclaimer**: This application is not a substitute for professional medical advice, diagnosis, or treatment. If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.
