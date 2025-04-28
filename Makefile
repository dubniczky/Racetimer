pi_ip ?= 10.0.2.37

# Transfer the application to the Raspberry Pi
transfer::
	rsync -avz --exclude node_modules/ --exclude .webpack/ ./ racetimer@$(pi_ip):/home/racetimer/app

package::
	npm run make

install::
	sudo dpkg -i out/make/deb/arm64/racetimer_*.deb