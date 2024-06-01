apiVersion: apps/v1
kind: Deployment
metadata:
  name: events-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: events
  template:
    metadata:
      labels:
        app: events
    spec:
      containers:
      - name: events
        image: krniya/fun-events
        env:
          - name: JWT_KEY
            valueFrom:
              secretKeyRef:
                name: jwt-secret
                key: JWT_KEY
          - name: NATS_CLIENT_ID
            valueFrom:
              fieldRef:
                fieldPath: metadata.name
          - name: MONGO_URI
            value: 'mongodb://events-mongo-srv:27017/events'
          - name: NATS_CLUSTER_ID
            value: 'events'
          - name: NATS_URL
            value: 'http://nats-srv:4222'
        resources:
          requests:
            memory: "756Mi"
            cpu: "450m"
          limits:
            memory: "1024Mi"
            cpu: "500m"
        ports:
        - containerPort: 3000


---

apiVersion: v1
kind: Service
metadata:
  name: events-srv
spec:
  selector:
    app: events
  ports:
  - name: events
    protocol: TCP
    port: 3000
    targetPort: 3000

