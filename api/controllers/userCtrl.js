'use strict';

module.exports.checkQuote = (req, res, next) => {
  const { User_Quote, Quote } = req.app.get("models");
  User_Quote.findAll({
    raw: true,
    where: {
      user_id: req.body.uid
    },
    include: [{ model: Quote, attributes: ['content'] }]
  }).then(quotes=>res.status(200).json(quotes));
};

module.exports.getUserQuotes = (req, res, next) => {
  const { User_Quote, Quote } = req.app.get("models");
  User_Quote.findAll({
    raw: true,
    where: {user_id: req.params.uid},
    include: [{ model: Quote, attributes: ['content', 'author'] }]
  }).then(quotes => {
    console.log(quotes);
    res.status(200).json(quotes);
  });
};

module.exports.addUserQuote = (req, res, next) => {
  const { User_Quote, Quote } = req.app.get("models");
  Quote.findOne({ where: { content: req.body.content } })
  .then(rsp => {
    if (!rsp) {
      Quote.create({ 
        content: req.body.content, 
        author: req.body.author
      }).then(newQuote => {
        User_Quote.create({
          user_id: req.body.uid,
          quote_id: newQuote.dataValues.id
        }).then(newQ => {
          res.status(201).json(newQ)
        });
      });
    } else {
      User_Quote.create({
        user_id: req.body.uid,
        quote_id: rsp.dataValues.id
      }).then(newQ => {
        res.status(201).json(newQ)
      });;
    }
  });
};

module.exports.deleteUserQuote = (req, res, next) => {
  const { User_Quote, Quote } = req.app.get("models");
  Quote.findOne({ raw: true, where: { content: req.body.content } })
    .then(rsp => {
      console.log(rsp.id, req.body.uid);
      User_Quote.destroy({
        where: {
          quote_id: rsp.id,
          user_id: req.body.uid
        }
      }).then(rmRsp=>res.status(201).json(rmRsp));
    });
};

module.exports.deleteUserQuoteById = (req, res, next) => {
  // console.log('this is in delete quote by id')
  const { User_Quote} = req.app.get("models");
    User_Quote.destroy({
      where: {
        quote_id: +req.params.id,
        user_id: +req.body.uid
      }
    }).then(rmRsp => res.status(201).json(rmRsp));
};


module.exports.addUserTag = (req, res, next) => {
  const { User_Tag, Tag } = req.app.get("models");
  Tag.findOne({where:{tag_content: req.body.tag}})
  .then(rsp => {
    if (!rsp) {
      Tag.create({tag_content: req.body.tag})
      .then(newTag => {
        User_Tag.create({
          user_id: req.body.uid,
          tag_id: newTag.dataValues.id
        });
      });
    } else {
      User_Tag.create({
        user_id: req.body.uid,
        tag_id: rsp.dataValues.id
      });
    }
  });
};
