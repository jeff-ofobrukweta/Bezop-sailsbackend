/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    createuser(req,res){
        const body = req.body;
        const firstname = body.firstname;
        const lastname = body.lastname;
        const email = body.email;
        const phoneNumber = body.phoneNumber;
        const password =body.password;
        const filedir = body.filedir;
        Files.create({filedir}).then((result) => {
            body.filedir = result.id;
            return Promise.all([result.id,User.create({firstname,lastname,email,phoneNumber,password})]);
        }).then((result) => {
            result[1].files.add(result[0]);
            result[1].save().then(()=>{
              console.log('the user has been succesfully added');
              return res.json(result);
            });
        }).catch((err) => {
            console.log(err);
            res.badRequest(err.invalidAttributes);
        });
    },

    addFilestouser(req, res) {
        const id = req.body.id;
        const filedir = req.body.filedir;

        User.findOne(id).then((result) => { 
            const sd = Files.create({filedir});
            return Promise.all([sd,result]);
        }).then((result) => { 
            result[1].files.add(result[0].id);
            result[1].save().then(()=>{});
            console.log(result)
            res.ok(result);
       }).catch((err) => {
            console.log(err);
            res.badRequest(err.invalidAttributes);
        });
    },

    
    Allusercred(req, res) {
        User.find().populate('files').then((response) => {
           // sails.log(videos)
            // console.log(sails.hooks.http.app);    
            return res.json(response);
        })
    },


	signup(req, res) {
        const body = req.body;
        User.create(body).then((user) => {
            res.json({user:user,message:"thank you for sigining up for cloud clox..!!"});
        }).catch((err) => {
            console.log(err);
            res.badRequest(err.invalidAttributes);
        });
    },
    All(req, res){
        const body = req.body;
        User.find(body).then((users)=> {
        return res.json(users);
        })
    },
    singleUser(req,res){
        const id = req.params.id;
        User.findOne(id).then((foundUser) => {
            if (!foundUser) {
              return res.notFound('Could not find user having same id credentials, sorry.')
            }
            return res.json(foundUser);
          }).catch((err)=>{
            res.badRequest(err);
          });
    },
    findonethroughEmail(req, res) {
        var firstname = req.body.firstname;
        var email = req.body.email;
        User.findOne({
            or: [
                { firstname: firstname },
                { email: email }
            ]
        }).exec(function (err, user) {
            console.log(user);
            res.json(user)
            if (err) {
                return res.json({ err });
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return res.json({ err });
            }
        });
    },
    destroyUser(req, res){
        const id = req.params.id;
        const username = req.body.username;
        User.destroy(id).then(function (err){
            if (err) {
              return res.negotiate(err);
            }
            sails.log(`The user(s) named ${username} have now been deleted, if there were any.`);
            return res.ok();
          });
    },
    updateUser(req,res){
        const id = req.params.id;
        const password = req.body.password;
        User.update({id:id},
        {
            password:password
        }
        ).then((updated)=>{
          res.json(updated[0])
        }).catch((err)=>{
            res.badRequest(err);
            console.log(`sorry the user cannot be updated due to the errors encountered`)
        });
       
    },
    updateUserwithname(req, res) {
        const id = req.params.id;
        const firstname = req.body.firstname;
        const secondname = req.body.secondname;
        const phone_number = req.body.phone_number;
        const email = req.body.email;
        const password = req.body.password;
        User.update({ email: email },
            {
                password: password
            }
        ).then((updated) => {
            console.log(`This is the new password ::::::${password}`)
            res.json(updated[0])
        }).catch((err) => {
            res.badRequest(err);
            console.log(`sorry the user cannot be updated due to the errors encountered`)
        });

    }
};

