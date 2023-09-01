# Infrastructure

## PGBouncer

To put a new database user on pgbouncer:

1. Execute:

```shell
./k8s/infra/pgbouncer/generate-userlist.sh
Enter username: test
Enter password: 
"test" "md5b494520d04649a80acf30929c833dc13"
```

2. Get the result and include in `main.tf - pgbouncer_secret`
