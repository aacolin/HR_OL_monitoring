To Compile : particle compile argon . --saveTo firmware.bin
    <li> This compiles for the boron platform. Other valid values can be found using particle compile --help. </li>
    <li> Note the period . by itself, separated by spaces. This means build the current directory and its subdirectories. </li>
    <li> --saveTo firmware.bin is optional, and specifies the filename to save the binary to. </li>

To flash : particle flash argon . 
    <li>  Replace my-devce-name with the name or Device ID (24 character he***REMOVED***) of your device. </li>
    <li>  Note the period . by itself, separated by spaces. This means build the current directory and its subdirectories.</li>
  
particle logout
particle login

particle flash argon . 
