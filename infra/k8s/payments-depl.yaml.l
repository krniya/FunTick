apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: payments
  template:
    metadata:
      labels:
        app: payments
    spec:
      containers:
        - name: payments
          image: stephengrider/payments
          env:
            - name: NATS_CLIENT_ID
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: NATS_URL
              value: 'http://nats-srv:4222'
            - name: NATS_CLUSTER_ID
              value: ticketing
            - name: MONGO_URI
              value: 'mongodb://payments-mongo-srv:27017/payments'
            - name: JWT_KEY
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: JWT_KEY
            - name: STRIPE_KEY
              valueFrom:
                secretKeyRef:
                  name: stripe-secret
                  key: STRIPE_KEY
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
  name: payments-srv
spec:
  selector:
    app: payments
  ports:
    - name: payments
      protocol: TCP
      port: 3000
      targetPort: 3000