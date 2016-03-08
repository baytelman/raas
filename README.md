# RAASTA - Ratings as a Service
[![wercker status](https://app.wercker.com/status/060efa84cf68b45c907109186971e70d/s "wercker status")](https://app.wercker.com/project/bykey/060efa84cf68b45c907109186971e70d)

Out-of-the-box User-Ratings Backend for Developers

[https://get-raasta.herokuapp.com](https://get-raasta.herokuapp.com)


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
