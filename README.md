# raas
[![wercker status](https://app.wercker.com/status/24aef573772ca3706026bf52c8a54d1f/s "wercker status")](https://app.wercker.com/project/bykey/24aef573772ca3706026bf52c8a54d1f)

Ratings-as-a-Service

# Usage

Retrieve stats for all ratings, no filter:
`GET http://localhost:3000/api/v1/ratings?token=ABC`

```json
{
    "message":"stats",
    "params":{},
    "stats":{
        "average":3.2,
        "count":5,
        "count1":1,
        "count2":1,
        "count3":0,
        "count4":2,
        "count5":1,
        "stddev":1.64317,
        "variance":2.7
    }
}
```

Add flters (user, key1-3):
`GET http://localhost:3000/api/v1/ratings?token=ABC&user=5729&key1=576`

```json
{
    "message":"stats",
    "params":{
        "key1":"576",
        "user":"5729"
    },
    "stats":{
        "average":3.2,
        "count":5,
        "count1":1,
        "count2":1,
        "count3":0,
        "count4":2,
        "count5":1,
        "stddev":1.64317,
        "variance":2.7
    }
}
```
