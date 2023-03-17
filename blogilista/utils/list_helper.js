const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes;
  }, 0);
};

const favouriteBlog = (blogs) => {
  const mostliked = blogs.reduce(
    (mostLiked, current) => {
      if (current.likes > mostLiked.likes) return current;
      else return mostLiked;
    },
    { title: "dummyTitle", likes: 0 }
  );
  if (mostliked.title === "dummyTitle") return null;
  else
    return {
      title: mostliked.title,
      author: mostliked.author,
      likes: mostliked.likes,
    };
};

function mostBlogs(blogs) {
  const authorLaskin = _.countBy(blogs, "author");
  const enitenBlogeja = _.maxBy(
    _.keys(authorLaskin),
    (author) => authorLaskin[author]
  );
  return { author: enitenBlogeja, blogs: authorLaskin[enitenBlogeja] };
}

function mostLikes(blogs) {
  const kirjailijanBlogit = _.groupBy(blogs, "author");
  const kirjailijaLikeTotal = _.mapValues(kirjailijanBlogit, (blogs) => {
    return _.sumBy(blogs, "likes");
  });
  const parasKirjailija = _.maxBy(
    _.keys(kirjailijaLikeTotal),
    (author) => kirjailijaLikeTotal[author]
  );
  return {
    author: parasKirjailija,
    likes: kirjailijaLikeTotal[parasKirjailija],
  };
}

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes };
