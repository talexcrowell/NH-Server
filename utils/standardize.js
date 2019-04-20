'use strict';

// component functions
function standardizeImgurData(results){
  return results.data.map(item => {
    // scope placeholders
    let img;
    let tag;
    let type;

    //select first image in gallery) for preview and retrieve appropriate link
    if(item.images){
      let itemMedia = item.images[0];

      if(item.type === 'video/mp4' || item.type ==='image/gif'){
        img = itemMedia.mp4;
      }
      else{
        img = itemMedia.link;
        type = itemMedia.type;
      }
    }
    //select image if not in a gallery
    else{
      img = item.link;
      type = item.type; 
    }

    //select first tag in tags array for category
    if(item.tags.length > 0){
      let input = item.tags[0];
      tag = input.name;
    }
    else{
      tag='';
    }

    //select

    //community item structured response
    return {
      id: item.id,
      url: item.link,
      title: item.title,
      img, 
      publishedAt: item.datetime,
      category: tag,
      type: type,
      source: 'imgur'
    };
  });
}

function standardizeRedditData(results){
  return results.children.map(item => {
    //create link for url
    let url = 'https://www.reddit.com'+item.data.permalink;
    let img;
    let type;
    if(item.data.url.includes('gfycat') === true){
      img = item.data.secure_media.oembed.thumbnail_url;
      type = 'image/gif';
    }
    else if(item.data.url.endsWith('.jpg') === false && item.data.url.endsWith('.gif') === false && item.data.url.endsWith('.png') === false){
      img = '';
      type = 'article';
    }
    else{
      img = item.data.url;
      type = 'image/jpg';
    }

    //community item structured response
    return {
      id: item.data.id,
      url,
      title: item.data.title,
      img: img, 
      publishedAt: item.data.created_utc,
      category: item.data.subreddit_name_prefixed,
      type,
      source: 'reddit'
    };
  });
}

module.exports = {standardizeImgurData, standardizeRedditData};