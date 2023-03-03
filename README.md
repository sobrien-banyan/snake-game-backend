# server for [Snake game](https://github.com/sobrien-banyan/snake-game)

## Over view
### This README lays out the steps for creating a mongodb on Mongdb Atlas, hosting the Node.js/express   server on an AWS EC2 instance and adding a domain name and SSL certificate. This repo is used with a react front-end: https://github.com/sobrien-banyan/snake-game

## Step to create mongo data base on MongoDB Atlas

1. Sign up or login to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register). You can follow the tutorial for creating a mongo database or follow the steps below.
2. On the home page select `New Project`
3. Select `Add Current IP Address`. Network Access will need to be updated to accept all IP address.
4. Select `Build a Database`.
5. Select `Free tier`. AWS for the provider and then select `Create`. 
6. On the left handside nav bar select `Network Access`.
7. Select `+ ADD IP ADDRESS`. Enter `0.0.0.0/0` for `Access List Entry:` and click `Confirm`.
8. Naviage to the project page titled `Data Deployments`. You should be on the Database Deployments page. Create an cluster by selecing `Create`.
9. Select `Shared`, `AWS` for the Cloud Provider, Region `N. Virginia`. Then Select `Create Cluster`.
10. Select the cluster, then Select `Collections`.
11. Select `+ Create Database`. For Database name enter `snake_game`. For Collection name enter `name_score` and press `Create `
12. Insert some data so we can test it later. Select `INSERT DOCUMENT`. Place the follow in the input and then press `Insert`:
```
{
  "name": "Shaun",
  "score": "10"
}
```
13. On the left handside nav bar select `Database Access` and then select `+ ADD NEW DATABASE USER`
14. Enter a name and password. Make sure the password has no special character in it. Save the name and password in a document, you'll need to later to construct the connection string. Select `Specific Privilege`, select `Add Specific Privilege`. The first dropdown select `readWrite`. Second input enter `snake_game`. Third input enter `name_score`. Toggle `Restrict Access to Specific Clusters/Federated Database Instances` and select the cluster the snake_game is in. Last click `Add User`.
15. On the left handside nav bar select `Database`. Select `Connect`. Select `Connect your application`. Copy the connection string, it will look like this `mongodb+srv://<username>:<password>@cluster0.v6q3wky.mongodb.net/?retryWrites=true&w=majority`. `<username>` and `<password>` are placeholders. Replace them with the name and password of user creacted in step the above step. This connection string will be added to the server config.env file in the EC2 instance using SSH.



## Steps taken to create server on an aws EC2 instance:

1. Create an EC2 instance on [aws](https://aws.amazon.com/) and host the express server
2. Navigte to the EC2 dashboard and select Launch Instance
3. Enter name
4. Under Application and OS Images (Amazon Machine Image) select `Ubuntu`
5. Under Key pair (login), select `create new key pair`. This will be used later to connect to the server through ssh terminal. A .pem file will be downloaded. Place it in a folder.
6. Under Network settings select `Allow HTTPS traffic from the Internet` and `Allow HTTP traffic from the internet`
7. Select `Launch instance`
8. Select `Connect to instance`
9. Select `SSH client`. There are two commands in the `SSH client` panel that need to be ran in a terminal. Examples: `chmod 400 <name-of-key>.pem` and `ssh -i "<name-of-key>.pem" ubuntu@ec2-3-83-25-6.compute-1.amazonaws.com`
10. Next we need to update the inbound rules on the EC2 instances. Select the EC2 instance... `EC3 > Instance > i-xxxxxxx`. Select the `Security` tab. Above Inbound rules select the link under Security groups e.g. `sg-01xxxxxxx(launch-wizard-7)`. Under Inbound rules select `Edit inbound rules`. Select `Add rule`. For Type dropdown select `HTTP` and Source dropdown select `Anywhere-IPv4` and click `Save rules`.  
11.  Next we need to login to the Ubuntu server hosted an aws through a terminal using the encoded .pem file. On a mac desktop open a terminal window and cd into the folder that contains the .pem file.
12. Run `ls` command. You should see the .pem file. 
13. Run the command `chmod 400 <name-of-key>.pem`
14. Run the command `ssh -i "<name-of-key>.pem" ubuntu@ec2-3-83-25-6.compute-1.amazonaws.com` enter `yes` and press return. You should see something like this in the terminal `ubuntu@ip-172-31-92-8:~/`
15. Next clone the repo `git clone https://github.com/sobrien-banyan/portfolio-server.git`
16. Cd into the repo
17. Run the following command to install node `curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -`. In this repo version 16.x is used.
18. Run the following command to finish intalling node.js and npm`sudo apt-get install -y nodejs`.
19. you might need to update npm by running this `sudo npm install -g npm@9.5.0`
20. Install the packages by running `npm install`
21. To keep the server running we need to install PM2 in the root directory. Enter the following command to get in the root directory `cd /` then run the follow command to install pm2 `sudo npm install pm2 -g`.
22. Install NGINX by running the following command in the root directory `sudo apt install nginx-core`.
23. Delete the default NGINX site config file with the command `sudo rm /etc/nginx/sites-available/default`.
24. Launch the nano text editor to create an new default site config file with `sudo nano /etc/nginx/sites-available/default`. A nano edit window will pop up. Paste the following: 
    ```
    server {
        listen 80;
        listen [::]:80;
        server_name _;

        # node api reverse proxy
        location / {
        proxy_pass http://localhost:4000/;
        }
    }
    ```
25. Press `y` and then enter.
26. Restart NGINX by running the following command `sudo systemctl reload nginx`
27. Navigate to the repo by entering `cd ~` then `ls` then cd into the repo.
28. Enter the ATLAS_URI in the config.env by enter the following command `nano config.env` grab the atlas uri from atlas mongodb and press `control x` and enter `y` then enter. Example of atlas uri: `ATLAS_URI=mongodb+srv://snake_game_user_access:v6flR0FC2ijcEOdR@cluster0.v6q3wky.mongodb.net/?retryWrites=true&w=majority`.
29. Start the server by running `pm2 start server.js`
30. Ping the server by grabbing the public IPv4 address from AWS. Put it in the browser address bar `http://18.210.17.248/record`. You should get back the record from atlas mongodb


## Steps for creating an SSL certificate and using it to connect to the server hosted on an EC2 instance.

### overview: Registering a domain name and using certbot to create an SSL certificate in SSH terminal.

- resource: [certbot](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal)

1. Register a domain name. I used [namecheap](https://www.namecheap.com/). Cost is a few dollor. Copy and save the domain name.
- Login to aws, navigate to the EC2 instance and grab the `Public IPv4 address`. It should look like `3.83.26.5`.
- login in to namecheap. On the dashboard find the domain name, on the left select `MANAGE`.
- Select `Advance DNS` and then select `+ ADD NEW RECORD`
- First dropdown (Type) select `A Record`
- Second input (Host) enter `@`
- Third input (Value) enter the `Public IPv4 address` from the aws EC2 instance.
- Fourth dropdown (TTL) select `Automatic`
- Select the green check mark to save the new record. 
2. Next we need to login to the Ubuntu server hosted an aws through a terminal using the encoded .pem file. On a mac desktop open a terminal window and cd into the folder that contains the .pem file.
3. Run `ls` command. You should see the .pem file. 
4. Run the command `chmod 400 <name-of-key>.pem`. `<name-of-key>` is a place holder. This the following command can be found on aws EC2 instance under `Connect to Instance` and  `SSH Client`.
5. Run the command `ssh -i "<name-of-key>.pem" ubuntu@ec2-3-83-25-6.compute-1.amazonaws.com` enter `yes` and press return. You should see something like this in the terminal `ubuntu@ip-172-31-92-8:~/`
6. Launch the nano text editor to create an new default site config file with `sudo nano /etc/nginx/sites-available/default`. A nano edit window will pop up. `<domain name>` is a placeholder in the code below and will need to be replace with the domain name from step one. Paste the following: 
    ```
    server {
        listen 80;
        listen [::]:80;
        server_name <domain name>;

        # node api reverse proxy
        location / {
        proxy_pass http://localhost:4000/;
        }
    }
    ```
7. Press `y` and then enter.
8. Restart NGINX by running the following command `sudo systemctl reload nginx`
9. We need to remove and reinstll certbot. Run the following commands:
- `cd /`
- `lsb_release -a`
- `sudo snap install core; sudo snap refresh core`
- `sudo apt-get remove certbot`
- `sudo snap install --classic certbot`
- `sudo certbot --nginx`
- Enter your email address and press return.
- Read the terms and enter `y`
- Enter `y` again
- Enter the domain name from step one. Press return
- If the terminal returns `Successfully deployed` you're good to go. If not run the following command, replacing `<domain name>` with domain from step one: `sudo certbot install --cert-name <domain name>`
- You are now ready to test. Place the following command in a browser address bar. `https://<domain name>/record`. You should get back the record from the mongodb. Use the same URL in your front-end code when making an api call. E.g. `await axios.get('https://<domain name>/record');`




















<!-- when install node-modules on the server run the following command `sudo apt install npm` & `sudo npm install pm2 -g`
`sudo apt-get install -y nodejs`
### to get the pm2/server to stay running `pm2 start npm --name "server`
`curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -`

`curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash `
### resource
https://jasonwatmore.com/post/2019/11/18/react-nodejs-on-aws-how-to-deploy-a-mern-stack-app-to-amazon-ec2 -->
