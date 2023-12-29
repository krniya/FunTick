apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: orders
  template:
    metadata:
      labels:
        app: orders
    spec:
      containers:
      - name: orders
        image: krniya/fun-orders
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
            value: 'mongodb://orders-mongo-srv:27017/orders'
          - name: NATS_CLUSTER_ID
            value: 'ordering'
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
  name: orders-srv
spec:
  selector:
    app: orders
  ports:
  - name: orders
    protocol: TCP
    port: 3000
    targetPort: 3000

