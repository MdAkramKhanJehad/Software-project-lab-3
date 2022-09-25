#!/bin/bash

mysql -u root --password="$MYSQL_ROOT_PASSWORD"  << EOF
update mysql.user set host = '%' where user='root';
USE ${MYSQL_DATABASE};
GRANT ALL PRIVILEGES ON  test_${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;

EOF

