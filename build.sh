ARGS=$(cat .env | sed 's/^/--build-arg /' | tr '\n' ' ')
docker build $ARGS -t simplegeek-react-app-server .
