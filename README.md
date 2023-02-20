# server for portfolio

## Steps taken to create server on an aws EC2 instance:

 1. Create an EC2 instance on [aws](https://aws.amazon.com/) and host the express server
    - Navigte to the EC2 dashboard and select Launch Instance
    - Enter name
    - Under Application and OS Images (Amazon Machine Image) select `Ubuntu`
    - Under Key pair (login), select `create new key pair`. This will be used later to connect to the server through ssh terminal. A .pem file will be downloaded. Place it in a folder.
    - Under Network settings select `Allow HTTPS traffic from the Internet` and `Allow HTTP traffic from the internet`
    - Select `Launch instance`
    - Select `Connect to instance`
    - Select `SSH client`. There are two commands in the `SSH client` panel that need to be ran in a terminal. Examples: `chmod 400 <name-of-key>.pem` and `ssh -i "<name-of-key>.pem" ubuntu@ec2-3-83-25-6.compute-1.amazonaws.com`
    - Next we need to login to the Ubuntu server hosted an aws through a terminal using the encoded .pem file. On a mac desktop open a terminal window and cd into the folder that contains the .pem file.
    - Run `ls` command. You should see the .pem file. 
    - Run the command `chmod 400 <name-of-key>.pem`
    - Run the command `ssh -i "<name-of-key>.pem" ubuntu@ec2-3-83-25-6.compute-1.amazonaws.com` enter `yes` and press return. You should see something like this in the terminal `ubuntu@ip-172-31-92-8:~/`
    - Next clone the repo `git clone https://github.com/sobrien-banyan/portfolio-server.git`
    - Cd into the repo
    - Run the following command to install node `curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -`. In this repo version 16.x is used.
    - Run the following command to finish intalling node.js and npm`sudo apt-get install -y nodejs`.
    - you might need to update npm by running this `sudo npm install -g npm@9.5.0`
    - Install the packages by running `npm install`
    - To keep the server running we need to install PM2 in the root directory. Enter the following command to get in the root directory `cd /` then run the follow command to install pm2 `sudo npm install pm2 -g`.
    - Install NGINX by running the following command in the root directory `sudo apt install nginx-core`.
    - Delete the default NGINX site config file with the command `sudo rm /etc/nginx/sites-available/default`.
    - Launch the nano text editor to create an new default site config file with `sudo nano /etc/nginx/sites-available/default`. A nano edit window will pop up. Paste the following: 
    ```
    server {
        listen 80 default_server;
        server_name _;
        location / {
             proxy_pass http://localhost:4000/;
            }

        }
    ```
    - Restart NGINX by running the following command `sudo systemctl reload nginx`
    - Navigate to the repo by entering `cd ~` then `ls` then cd into the repo.
    - Enter the ATLAS_URI in the config.env by enter the following command `nano config.env` grab the atlas uri from atlas mongodb and press `control x` and enter `y` then enter.
    - Start the server by running `pm2 start server.js`
    - Ping the server by grabbing the public IPv4 address from AWS. Put it in the browser address bar `http://18.210.17.248/record`





















when install node-modules on the server run the following command `sudo apt install npm` & `sudo npm install pm2 -g`
`sudo apt-get install -y nodejs`
### to get the pm2/server to stay running `pm2 start npm --name "server`
`curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -`

`curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash `
### resource
https://jasonwatmore.com/post/2019/11/18/react-nodejs-on-aws-how-to-deploy-a-mern-stack-app-to-amazon-ec2