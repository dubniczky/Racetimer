pi_ip ?= 10.0.2.37

# Transfer the application to the Raspberry Pi
transfer::
	rsync -avz --exclude node_modules/ --exclude .webpack/ ./ racetimer@$(pi_ip):/home/racetimer/app