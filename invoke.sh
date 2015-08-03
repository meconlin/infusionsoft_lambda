# INVOKE
# run the lambda function
# sends up test data to create/update user
#

. envs.sh

echo "Starting invoke"
echo "-------------------------------------"
echo "Will call: "
echo "function : $function"
echo "role : $lambda_execution_role_name"
echo "policy : $lambda_execution_access_policy_name"
echo "-------------------------------------"

aws lambda invoke \
--invocation-type RequestResponse \
--function-name "$function" \
--region us-east-1 \
--log-type Tail \
--payload '{"firstName":"Tyler", "lastName":"Dyrden", "email":"tyler.dyrden@projectmayhem.com", "tagId":"103"  }' \
outputfile.txt


echo "--------------------------------------"
echo "Done invoke "
