# server for portfolio

## Over view
### This README lays out the steps for creating a mongodb on Mongdb Atlas, hosting the Node.js/express   server on an AWS EC2 instance and adding a domain name and SSL certificate.

## Step to create mongo data base on MongoDB Atlas

1. Sign up or login to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. 

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
25. Press `y` and enter.
26. Restart NGINX by running the following command `sudo systemctl reload nginx`
27. Navigate to the repo by entering `cd ~` then `ls` then cd into the repo.
28. Enter the ATLAS_URI in the config.env by enter the following command `nano config.env` grab the atlas uri from atlas mongodb and press `control x` and enter `y` then enter. Example of atlas uri: `ATLAS_URI=mongodb+srv://snake_game_user_access:v6flR0FC2ijcEOdR@cluster0.v6q3wky.mongodb.net/?retryWrites=true&w=majority`.
29. Start the server by running `pm2 start server.js`
30. Ping the server by grabbing the public IPv4 address from AWS. Put it in the browser address bar `http://18.210.17.248/record`. You should get back the record from atlas mongodb





















when install node-modules on the server run the following command `sudo apt install npm` & `sudo npm install pm2 -g`
`sudo apt-get install -y nodejs`
### to get the pm2/server to stay running `pm2 start npm --name "server`
`curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -`

`curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash `
### resource
https://jasonwatmore.com/post/2019/11/18/react-nodejs-on-aws-how-to-deploy-a-mern-stack-app-to-amazon-ec2