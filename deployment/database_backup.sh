#!/bin/bash
database=DB3519304
username=U3519304
password=1QAY2wsx3EDC4rfv
port=3306
host=rdbms.strato.de
today=`date +%Y%m%d_%H%M%S`
echo $today
struct=${today}_${database}_struct.sql
data=${today}_${database}_data.sql
trigger=${today}_${database}_trigger.sql
common="--comments --complete-insert --create-options --order-by-primary --quote-names --single-transaction --dump-date --skip-extended-insert"
mysqldump ${common} --no-data --skip-triggers --skip-routines -h ${host} -r data/${struct} -u ${username} -P ${port} -p${password} ${database}
mysqldump ${common} --no-create-info --no-create-db --no-data --routines -h ${host} -r data/${trigger} -u ${username} -P ${port} -p${password} ${database}
if [[ "$1" == "--no-user" ]]; then
    mysqldump ${common} --no-create-info --no-create-db --skip-routines --skip-triggers \
        --ignore-table=DB3519304.s_order --ignore-table=DB3519304.s_order_attributes --ignore-table=DB3519304.s_order_backup \
        --ignore-table=DB3519304.s_order_basket --ignore-table=DB3519304.s_order_basket_attributes --ignore-table=DB3519304.s_order_basket_saved \
        --ignore-table=DB3519304.s_order_basket_saved_items --ignore-table=DB3519304.s_order_basket_signatures --ignore-table=DB3519304.s_order_billingaddress \
        --ignore-table=DB3519304.s_order_billingaddress_attributes --ignore-table=DB3519304.s_order_comparisons --ignore-table=DB3519304.s_order_details \
        --ignore-table=DB3519304.s_order_details_attributes --ignore-table=DB3519304.s_order_history --ignore-table=DB3519304.s_order_documents \
        --ignore-table=DB3519304.s_order_documents_attributes --ignore-table=DB3519304.s_order_esd --ignore-table=DB3519304.s_order_history \
        --ignore-table=DB3519304.s_order_notes --ignore-table=DB3519304.s_order_shippingaddress --ignore-table=DB3519304.s_order_shippingaddress_attributes \
        --ignore-table=DB3519304.s_statistics_referer --ignore-table=DB3519304.s_user --ignore-table=DB3519304.s_user_addresses \
        --ignore-table=DB3519304.s_user_addresses_attributes --ignore-table=DB3519304.s_user_attributes --ignore-table=DB3519304.s_user_billingaddress \
        --ignore-table=DB3519304.s_user_billingaddress_attributes --ignore-table=DB3519304.s_user_shippingaddress --ignore-table=DB3519304.s_user_shippingaddress_attributes \
        -h ${host} -r data/${data} -u ${username} -P ${port} -p${password} ${database}
else
        mysqldump ${common} --no-create-info --no-create-db --skip-routines --skip-triggers \
                -h ${host} -r data/${data} -u ${username} -P ${port} -p${password} ${database}
fi
