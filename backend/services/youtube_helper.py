import requests

def get_youtube_playlist_count(playlist_id, api_key):
    url = "https://www.googleapis.com/youtube/v3/playlistItems"
    total_count = 0
    next_page_token = None

    while True:
        params = {
            "part": "id",
            "playlistId": playlist_id,
            "maxResults": 50,
            "key": api_key
        }

        if next_page_token:
            params["pageToken"] = next_page_token

        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()

        total_count += len(data.get("items", []))
        next_page_token = data.get("nextPageToken")

        if not next_page_token:
            break

    return total_count