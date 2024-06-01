apiVersion: apps/v1
kind: Deployment
metadata:
  name: events-mongo-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: events-mongo
  template:
    metadata:
      labels:
        app: events-mongo
    spec:
      containers:
      - name: events-mongo
        image: mongo
        resources:
          requests:
            memory: "756Mi"
            cpu: "450m"
          limits:
            memory: "1024Mi"
            cpu: "500m"

---

apiVersion: v1
kind: Service
metadata:
  name: events-mongo-srv
spec:
  selector:
    app: events-mongo
  ports:
  - name: db
    protocol: TCP
    port: 27017
    targetPort: 27017