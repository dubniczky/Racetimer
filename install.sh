npm run make
sudo dpkg -i out/make/deb/arm64/racetimer_1.0.0_arm64.deb

sudo cp racetimer.service /etc/systemd/system/racetimer.service
sudo systemctl daemon-reexec
sudo systemctl daemon-reload