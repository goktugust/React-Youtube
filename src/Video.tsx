import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Embed,
  Form,
  Grid,
  GridColumn,
  Segment,
} from "semantic-ui-react";
import { Item } from "./model/IVideos";

export default function Video() {
  const [video, setVideo] = useState<Item>();
  const [localStatus, setLocalStatus] = useState(true);
  const [add, setAdd] = useState(true);
  const [del, setDel] = useState(true);

  useEffect(() => {
    checkLocal();
    addRemoveControl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [add, del]);

  function getDate(time: Date) {
    const str = String(time);
    const date = moment(str);
    const dateComp = date.utc().format("YYYY-MM-DD");
    const timeComp = date.utc().format("HH:mm:ss");
    return dateComp + " " + timeComp;
  }

  function checkLocal() {
    const local = localStorage.getItem("videoLocal");
    const parseLocal = JSON.parse(local!);
    if (local != null && parseLocal !== undefined) {
      console.log("parseLocal :>> ", parseLocal);
      setVideo(parseLocal);
    } else {
      window.location.href = "/";
    }
  }

  function addFavorites() {
    const favoritesLocal = localStorage.getItem("favoritesLocal");
    if (favoritesLocal == null && video !== undefined) {
      const favArr: Item[] = [];
      favArr.push(video);
      localStorage.setItem("favoritesLocal", JSON.stringify(favArr));
      setAdd(true);
      setDel(false);
    } else if (favoritesLocal != null && video !== undefined) {
      const parsedLocal: Item[] = JSON.parse(favoritesLocal);
      for (const item of parsedLocal) {
        if (item.id?.videoId === video.id?.videoId) {
          setLocalStatus(!localStatus);
          break;
        }
      }
      if (localStatus) {
        parsedLocal.push(video);
        localStorage.setItem("favoritesLocal", JSON.stringify(parsedLocal));
        setAdd(true);
        setDel(false);
      }
    }
  }

  function addRemoveControl() {
    const favorites = localStorage.getItem("favoritesLocal");
    let st = true;
    if (favorites === null) {
      setDel(true);
      setAdd(false);
    } else if (favorites != null) {
      const parsedFavs: Item[] = JSON.parse(favorites);
      for (const index in parsedFavs) {
        if (parsedFavs[index].id?.videoId === video?.id?.videoId) {
          setDel(false);
          setAdd(true);
          st = false;
          break;
        }
      }
      if (st) {
        setDel(true);
        setAdd(false);
      }
    }
  }

  function dellFavorites() {
    const favVids = localStorage.getItem("favoritesLocal");
    const parsedFavVids: Item[] = JSON.parse(favVids!);
    const index = parsedFavVids.indexOf(video!);
    parsedFavVids.splice(index, 1);
    if (parsedFavVids.length > 0) {
      localStorage.setItem("favoritesLocal", JSON.stringify(parsedFavVids));
    } else {
      localStorage.removeItem("favoritesLocal");
    }
    setDel(true);
    setAdd(false);
  }

  return (
    <>
      <Container>
        <Button
          style={{ marginTop: 40 }}
          color="youtube"
          icon="arrow alternate circle left outline"
          as={Link}
          to={"/"}
          content="Geri Dön"
        />
        <Grid doubling columns="2">
          {video && (
            <Fragment>
              <GridColumn width="12">
                <Embed
                  id={video?.id?.videoId}
                  active
                  source="youtube"
                  onClick={(e, data) => console.log(e)}
                  iframe={{
                    allowFullScreen: true,

                    style: {
                      padding: 10,
                    },
                  }}
                />
              </GridColumn>
              <GridColumn width="4">
                <Form>
                  <h2>Video Information</h2>
                  <Form.Field>
                    <label> Title </label>
                    <Segment>
                      {" "}
                      <p> {video.snippet?.title} </p>{" "}
                    </Segment>
                  </Form.Field>
                  <Form.Field>
                    <label> Detail </label>
                    <Segment>
                      {" "}
                      <p> {video.snippet?.description} </p>{" "}
                    </Segment>
                  </Form.Field>
                  <Form.Field>
                    <label> Publish Date </label>
                    <Segment>
                      {" "}
                      <p> {getDate(video.snippet?.publishTime!)} </p>{" "}
                    </Segment>
                  </Form.Field>
                  <Form.Field>
                    <label> Channel Title </label>
                    <Segment>
                      {" "}
                      <p> {video.snippet?.channelTitle} </p>{" "}
                    </Segment>
                  </Form.Field>
                  <Button
                    title="Favorilere Ekle!"
                    icon="star"
                    color="youtube"
                    disabled={add}
                    type="submit"
                    onClick={() => addFavorites()}
                  />
                  <Button
                    title="Favorilerden Çıkar!"
                    icon="remove circle"
                    color="yellow"
                    disabled={del}
                    type="submit"
                    onClick={() => dellFavorites()}
                  />
                </Form>
              </GridColumn>
            </Fragment>
          )}
        </Grid>
      </Container>
    </>
  );
}
