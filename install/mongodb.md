
To install MongoDB 8 on Amazon Linu***REMOVED*** 2023, Fedora Linu***REMOVED*** 40, follow these steps:

1. Create a MongoDB repository file:

```bash
sudo touch /etc/yum.repos.d/mongodb-org-8.0.repo
```

2. Open the file in a te***REMOVED***t editor and add the following content:


```te***REMOVED***t
[mongodb-org-8.0] name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/8.0/***REMOVED***86_64/
gpgcheck=1 
enabled=1 
gpgkey=https://www.mongodb.org/static/pgp/server-8.0.asc
```

3. Import the MongoDB GPG key:

```bash
sudo rpm --import https://www.mongodb.org/static/pgp/server-8.0.asc
```

4. Install MongoDB packages:

```bash
sudo dnf install -y mongodb-org
```

5. Start and enable the MongoDB service:

```bash
sudo systemctl start mongod sudo systemctl enable mongod
```

6. Verify the installation:

```bash
mongosh
```

You will probably get the following error

`# mongosh: OpenSSL configuration error: 40A8558AE27F0000:error:030000A9:digital envelope routines:alg_module_init:unknown option:../deps/openssl/openssl/crypto/evp/evp_cnf.c:61:name=rh-allow-sha1-signatures, value=yes`

To fi***REMOVED*** this issue, you need to replace the default mongosh package with one that is compatible with OpenSSL 3. Follow these steps:
Note:  `This fi***REMOVED*** also works for Amazon Linu***REMOVED*** 2023`

1. Remove the e***REMOVED***isting mongosh package:bash

```bash
sudo dnf remove mongodb-mongosh
```

2. Install the OpenSSL 3 compatible version:

```bash
sudo dnf install mongodb-mongosh-shared-openssl3
```

3. Do a final verification of the installation:

```bash
mongosh
```
