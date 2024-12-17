# Particle CLI Commands for Argon

## To Compile the Firmware

Use the following command to compile the firmware for the **Argon** platform:

1. CLI compile locally:
   ```bash
    particle compile argon . --saveTo firmware.bin
   ```

2. Flash locally:
   ```bash
      particle flash argon --local  firmware.bin

   ```

3. Serial Monitor for debug :
   ```bash
      particle serial monitor

   ```
