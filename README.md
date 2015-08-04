## InfusionSoft Create/Update Contact - AWS Lambda MicroService

InfusionSoft create/update contact node.js application designed to be used as an [AWS Lambda Function](https://aws.amazon.com/lambda/). 
Once deployed this micro service will add/update, opt-in, and tag a contact in highly scalable fashion. 

### Requirements

- aws account
- python ~2.7.5
- aws cli ~1.7.42 
- aws creds in your ~/.aws directory will need:
  - create/delete role permissions
  - create/delete lambda permissions
- infusionsoft account with api key

### Backstory
A rails application at work uses the [infusionsoft gem](https://github.com/nateleavitt/infusionsoft) to start marketing campaigns for a user once they perform a specific action. 

Whenever a contact is added or performs a behavior we wish to;
- call add/update contact with dup check
- optin the contact
- add the contact to a group/tag (to kick off specific campaign) based on the behavior they performed

This requires three networks calls (create/update, optin, tag with behavior). 
As an experiement I created a micro-service using AWS Lambda making this into a single call for our web/mobile product.  
Yes, of course I could simply accomplish this using a [sidekiq](https://github.com/mperham/sidekiq) worker but what fun would that have been? 

### Usage
To get started I recommend [this great tutorial on using AWS Lambda](http://docs.aws.amazon.com/lambda/latest/dg/getting-started-custom-events.html). 

- clone this repo
- create zip file index.zip ```$>zip -r index.zip index.js config.js node_modules/*```
- update ```config.js``` with your infusion soft key and application name
- run ```./setup.sh```,```./invoke.sh```,```./teardown.sh``` to build, test, and remove your function and related policies. 

```index.js``` contains code that will create, optin, and tag a user when it recieves an event like so:
```
{
  "firstName": "Tyler",
  "lastName": "Dyrden",
  "email": "t.dyrden@gmail.com",
  "tagId": 103
}
```

**firstName/lastName** : contact first and lastname  
**email** : contacts should be considered unique in your Infusionsoft CRM by email  
**tagId** : this must be the unique ID of the behavior you wish to attribute to this user (eg. report saved, account created). 

### Improvements
This is a fun POC, but there is much to do to master deploying production ready micro services. 

Some ideas:  
- setup AWS Lambda logging configuration, maybe Cloudwatch -> S3 bucket?
- lookup tagId by tagname, not count on id from client
- extend shell setup create API in front of the function using the new [API Gateway](http://aws.amazon.com/documentation/apigateway/)
- asynch vs. request response function... whats my real goal here














