# API response

```
{
    "data": {
        "id": 1,
        "attributes": {
            "page_title": "home",
            "page_subheading": "This is the homepage",
            "body_text": "<p>This is some text for the home page</p>",
            "show_leaderboard": true,
            "createdAt": "2022-06-22T11:19:19.256Z",
            "updatedAt": "2022-06-22T14:12:52.869Z",
            "discipline_cards": [
                {
                    "id": 1,
                    "title": "card",
                    "description": "This is a discipline card",
                    "icon_name": "something",
                    "url": "google.com"
                }
            ],
            "leaderboard": {
                "id": 1,
                "body": "<p>This is a bit of text for the leaderboard</p>"
            },
            "notices": {
                "data": {
                    "id": 1,
                    "attributes": {
                        "name": "Test notice",
                        "content": "<p>Some content for the test</p>",
                        "type": "SECONDARY",
                        "createdAt": "2022-06-22T10:23:36.418Z",
                        "updatedAt": "2022-06-22T10:23:37.849Z",
                        "publishedAt": "2022-06-22T10:23:37.845Z"
                    }
                }
            },
            "hero_image": {
                "data": [
                    {
                        "id": 3,
                        "attributes": {
                            "name": "hero-example.jpeg",
                            "alternativeText": "hero-example.jpeg",
                            "caption": "hero-example.jpeg",
                            "width": 1300,
                            "height": 760,
                            "formats": {
                                "thumbnail": {
                                    "name": "thumbnail_hero-example.jpeg",
                                    "hash": "thumbnail_hero_example_08045d56f7",
                                    "ext": ".jpeg",
                                    "mime": "image/jpeg",
                                    "path": null,
                                    "width": 245,
                                    "height": 143,
                                    "size": 7.86,
                                    "url": "/uploads/thumbnail_hero_example_08045d56f7.jpeg"
                                },
                                "large": {
                                    "name": "large_hero-example.jpeg",
                                    "hash": "large_hero_example_08045d56f7",
                                    "ext": ".jpeg",
                                    "mime": "image/jpeg",
                                    "path": null,
                                    "width": 1000,
                                    "height": 585,
                                    "size": 116.94,
                                    "url": "/uploads/large_hero_example_08045d56f7.jpeg"
                                },
                                "medium": {
                                    "name": "medium_hero-example.jpeg",
                                    "hash": "medium_hero_example_08045d56f7",
                                    "ext": ".jpeg",
                                    "mime": "image/jpeg",
                                    "path": null,
                                    "width": 750,
                                    "height": 438,
                                    "size": 68.46,
                                    "url": "/uploads/medium_hero_example_08045d56f7.jpeg"
                                },
                                "small": {
                                    "name": "small_hero-example.jpeg",
                                    "hash": "small_hero_example_08045d56f7",
                                    "ext": ".jpeg",
                                    "mime": "image/jpeg",
                                    "path": null,
                                    "width": 500,
                                    "height": 292,
                                    "size": 31.8,
                                    "url": "/uploads/small_hero_example_08045d56f7.jpeg"
                                }
                            },
                            "hash": "hero_example_08045d56f7",
                            "ext": ".jpeg",
                            "mime": "image/jpeg",
                            "size": 190.52,
                            "url": "/uploads/hero_example_08045d56f7.jpeg",
                            "previewUrl": null,
                            "provider": "local",
                            "provider_metadata": null,
                            "createdAt": "2022-06-22T14:12:42.041Z",
                            "updatedAt": "2022-06-22T14:12:42.041Z"
                        }
                    }
                ]
            }
        }
    },
    "meta": {}
}
```
