import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Container,
  Form,
  Grid,
  Input,
  Image,
  GridColumn,
  Segment,
  Icon,
  CardContent
} from "semantic-ui-react";
import { getVideos } from "./config/Service";
import { Item } from "./model/IVideos";

export default function Home() {
  const [videos, setVideos] = useState<Item[]>([]);
  const [input, setInput] = useState("");
  const [lastVideos, setLastVideos] = useState<Item[]>([]);
  const [favVideos, setFavVideos] = useState<Item[]>([]);

  useEffect(() => {
    getLastVideos();
    
  }, []);
  useEffect(() => {
    getFavVideos();
  }, [])
  function getLastVideos() {
    const lastVids = localStorage.getItem("lastWatched");
    if (lastVids != null) {
      const parsedLastVids: Item[] = JSON.parse(lastVids);
      setLastVideos(parsedLastVids);
    }
  }
  function getFavVideos() {
    const favVids = localStorage.getItem("favoritesLocal");
    if (favVids != null) {
      const parsedFavVids: Item[] = JSON.parse(favVids);
      setFavVideos(parsedFavVids);
    }
  }
  function removeFavVid(index:number) {
    const favVids = localStorage.getItem("favoritesLocal");
    const parsedFavVids: Item[] = JSON.parse(favVids!);
    parsedFavVids.splice(index,1);
    setFavVideos(parsedFavVids);
    if (parsedFavVids.length > 0) {
      localStorage.setItem("favoritesLocal",JSON.stringify(parsedFavVids));
    }else {
      localStorage.removeItem("favoritesLocal")
    }
  }

  function getVideo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(input);
    getVideos(input).then((res) => {
      console.log("Çalıştı");
      const vidArr: Item[] = [];
      res.data.items.map((item: Item) => {
        return vidArr.push(item);
      });
      setVideos(vidArr);
    });
  }
  // do nothing

  function cardDetail(video: Item) {
    localStorage.setItem("videoLocal", JSON.stringify(video));
    const lastWatched = localStorage.getItem("lastWatched");
    if (lastWatched == null) {
      const lastWatchedArr: Item[] = [];
      lastWatchedArr.unshift(video);
      localStorage.setItem("lastWatched", JSON.stringify(lastWatchedArr));
    } else {
      const parsedLastWatched: Item[] = JSON.parse(lastWatched);
      parsedLastWatched.unshift(video);
      if (parsedLastWatched.length > 6) {
        parsedLastWatched.pop();
      }
      localStorage.setItem("lastWatched", JSON.stringify(parsedLastWatched));
    }
  }

  function getLocalTime(time:Date) {
    const str = String(time);
    const date = moment(str);
    const dateComp = date.utc().format('YYYY-MM-DD');
    const timeComp = date.utc().format('HH:mm:ss');
    return (dateComp + " " + timeComp)
  }
  return (
    <>
      <Container textAlign="center" style={{ marginBottom: 40 }}>
        <h1 style={{ color: "rgb(255,1,0)" }}>
          -0-0-0-0-0-0- Yotube Arama Api -0-0-0-0-0-0-
        </h1>
        <Form onSubmit={(e) => getVideo(e)}>
          <Input
            required
            onChange={(e) => setInput(e.target.value)}
            action={{
              type: "submit",
              icon: "search",
              color: "youtube",
            }}
            placeholder="Arama Yap"
            focus
          />
        </Form>
        <Segment>
          {videos.length > 0 && (
            <h2 style={{ color: "rgb(255,1,0)" }}>Search Results</h2>
          )}
          <Grid style={{ textAlign: "-webkit-center" }} columns="3">
            {videos.length > 0 &&
              videos.map((item, index) => {
                return (
                  <GridColumn key={index}>
                    <Card
                      as={Link}
                      to={"/video/" + item.id?.videoId}
                      onClick={() => cardDetail(item)}
                    >
                      <Image
                        src={item.snippet?.thumbnails?.high?.url}
                        width={item.snippet?.thumbnails?.high?.width}
                        wrapped
                        ui={false}
                      />
                      <Card.Content>
                        <Card.Header
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {item.snippet?.title}
                        </Card.Header>
                        <Card.Meta>
                          <span className="date">
                            {getLocalTime(item.snippet?.publishTime!)}
                          </span>
                        </Card.Meta>
                        <Card.Description>
                          {item.snippet?.channelTitle}
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  </GridColumn>
                );
              })}
          </Grid>
        </Segment>
        <Segment style={{ marginBottom: 40 }}>
          {favVideos.length > 0 && <h2 style={{ color: "rgb(255,1,0)" }}>Favorites</h2>}
          <Grid style={{ textAlign: "-webkit-center" }} columns="3">
            {favVideos.length > 0 &&
              favVideos.map((item, index) => {
                return (
                  <GridColumn key={index}>
                    
                    <Card
                      as={Link}
                      to={"/video/" + item.id?.videoId}
                      onClick={() => cardDetail(item)}
                    >
                      <Image
                        src={item.snippet?.thumbnails?.high?.url}
                        width={item.snippet?.thumbnails?.high?.width}
                        wrapped
                        ui={false}
                      />
                      <Card.Content>
                        <Card.Header
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {item.snippet?.title}
                        </Card.Header>
                        <Card.Meta>
                          <span className="date">
                            {getLocalTime(item.snippet?.publishTime!)}
                          </span>
                        </Card.Meta>
                        <Card.Description>
                        {item.snippet?.channelTitle}
                        </Card.Description>
                      </Card.Content>
                    </Card>
                    <CardContent  extra>
                    <Icon position="left" title="Favorilerden Çıkar" link  onClick={() => {removeFavVid(index)}} size="big" name="remove circle" style={{"color": "rgb(255,1,0)"}} />
                    </CardContent>
                  </GridColumn>
                );
              })}
          </Grid>
        </Segment>
        <Segment>
          {lastVideos.length > 0 && <h2 style={{ color: "rgb(255,1,0)" }}>Last Watched</h2>}
          <Grid style={{ textAlign: "-webkit-center" }} columns="3">
            {lastVideos.length > 0 &&
              lastVideos.map((item, index) => {
                return (
                  <GridColumn key={index}>
                    <Card
                      as={Link}
                      to={"/video/" + item.id?.videoId}
                      onClick={() => cardDetail(item)}
                    >
                      <Image
                        src={item.snippet?.thumbnails?.high?.url}
                        width={item.snippet?.thumbnails?.high?.width}
                        wrapped
                        ui={false}
                      />
                      <Card.Content>
                        <Card.Header
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {item.snippet?.title}
                        </Card.Header>
                        <Card.Meta>
                          <span className="date">
                            {getLocalTime(item.snippet?.publishTime!)}
                          </span>
                        </Card.Meta>
                        <Card.Description>
                          {item.snippet?.channelTitle}
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  </GridColumn>
                );
              })}
          </Grid>
        </Segment>
      </Container>
    </>
  );
}
