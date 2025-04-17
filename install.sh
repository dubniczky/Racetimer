# Install the required pigpiod service
sudo apt install -y pigpio
sudo systemctl enable pigpiod
sudo systemctl start pigpiod

# Build the electron js app into a deb package
npm run make
# Install the deb package
sudo dpkg -i $(ls -t dist/racetimer-*.deb | head -n 1)

# Install the service for auto-start
sudo cp racetimer.service /etc/systemd/system/racetimer.service
sudo systemctl daemon-reload
sudo systemctl enable racetimer.service
sudo systemctl start racetimer.service
