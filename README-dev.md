## Local devlopment

```
# Get the frontend source
git clone git@github.com:LCOGT/hermes-frontend.git
cd hermes-frontend

# Install Node.js packages - creates and populates node_modules directory
npm install

# let the frontend know where to find the backend
echo "VUE_APP_HERMES_BACKEND_ROOT_URL=http://hermes-dev.lco.gtn/" > .env.local

# run the Development server with hot reloads
npm run serve

# Point your browser at the URL output by the development server
```
