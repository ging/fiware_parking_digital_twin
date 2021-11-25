curl -v  $1/v2/subscriptions -s -S -H 'Content-Type: application/json' -d @- <<EOF
{
  "description": "A subscription to get ticket predictions",
  "subject": {
	"entities": [
  	{
    	"id": "ReqTicketPrediction1",
    	"type": "ReqTicketPrediction"
  	}
	],
	"condition": {
  	"attrs": [
      "predictionId",
      "socketId",
      "name",
      "year",
      "month",
      "day",
      "weekday",
      "time"
  	]
	}
  },
  "notification": {
	"http": {
  	"url": "http://spark-predict-svc:9001"
	},
	"attrs": [
      "predictionId",
      "socketId",
      "name",
      "year",
      "month",
      "day",
      "weekday",
      "time"
	]
  },
  "expires": "2040-01-01T14:00:00.00Z",
  "throttling": 5
}
EOF