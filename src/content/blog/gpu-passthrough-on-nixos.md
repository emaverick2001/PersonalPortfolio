---
title: GPU passthrough on NixOS to a Windows 11 VM
publishDate: 2025-03-29
---

Last week, I set up GPU passthrough on NixOS, enabling me to run a Windows 11
virtual machine with near-native performance! This post is an overview of the
process.

## Why?

I recently wanted to try writing a Skyrim mod. My mod idea was beyond the scope
of most Skyrim mods: it would make network calls, dynamically create items in
the world based on those results, etc.

While Linux gaming has come quite far, some of the more involved tools for
Skyrim modding only support Windows. To my surprise, this was a barrier for me -
I don't have a single Windows machine around anymore! I run NixOS on my desktop
and laptop and stopped dual-booting years ago. 

This left me with a few options. I could either

- Set up dual-boot again
- Get all of Skyrim's modding tools working through Wine
- Set up a Windows VM with GPU passthrough

Dual-booting would be easiest, but I stopped doing it in the first place because
I found it annoying to reboot into a different operating system whenever I
wanted to use a different application. The Wine route didn't sound very
appealing, and I got [nerd-sniped](https://xkcd.com/356/) by the potential of
GPU passthrough.

## Setting up the virtual machine

While most posts on this topic start by setting up GPU passthrough first and the
VM second, I started by setting up the VM first. I was hoping that I could get
by with a basic VM with no passthrough at first. Skyrim's an old game, and I
remember running it 10 years ago on a weak laptop with integrated graphics.
Perhaps a VM on modern hardware would be enough!

Setting up a VM isn't too difficult on NixOS, but it helps to understand how it
works. Linux virtualization has many moving parts, so here's a high-level
overview:

**KVM** (Kernel-based Virtual Machine) is a hypervisor built into the Linux
kernel, allowing the OS to take advantage of hardware virtualization features.

**QEMU** (Quick Emulator) actually handles creating and running VMs, and can
pair with KVM to take advantage of hardware. It also supports **virtio**, which
allows the guest OS to communicate with the host through paravirtualized
drivers. This means that rather than emulating an entire disk drive or network
card, the guest can use the drivers to talk directly to the host for this
functionality. This makes things _fast_.

**libvirt** provides a nice abstraction over many virtualization platforms,
including QEMU/KVM.

**virt-manager** is a GUI tool on top of libvirt, allowing us to manage VMs
similar to applications like VirtualBox.

There's also **OVMF**, which allows the VM to use UEFI. This is helpful for GPU
passthrough.

Here's the corresponding NixOS config, which I broke out into a separate module:

```nix
{ pkgs, ... }:

{
  virtualisation = {
    libvirtd = {
      enable = true;
      qemu = {
        package = pkgs.qemu_kvm;
        ovmf.enable = true;
        swtpm.enable = true;
      };
    };
  };

  users.users.violet.extraGroups = [ "libvirtd" "kvm" ];
  environment.systemPackages = [ pkgs.virt-manager ];
}
```

The only piece that I didn't mention is `swtpm`, which allows the VM to
emulate a TPM. This is needed because the Windows 11 installer wants to see a
TPM when checking hardware compatibility.

It took me a bit to figure out get past the TPM issue, but the rest of the VM
setup was straightforward:

- Install the [Windows 11
ISO](https://www.microsoft.com/en-us/software-download/windows11) and add it to
a virtual disk drive
- Install the [virtio drivers
ISO](https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers) and add them to a
second disk drive
- Ensure the main disk and network card were configured to use virtio
- During the install, Windows 11 tries to force you to sign in with a Microsoft
account. This can be bypassed by disabling the network adapter, hitting `Shift +
F10` to open a command prompt, and typing `oobe\bypassnro` to reboot with the
option to skip online sign in. Coincidentally, [I read this morning that
Microsoft is disabling this
feature](https://www.tomshardware.com/software/windows/microsoft-eliminates-workaround-that-circumvents-microsoft-account-requirement-during-windows-11-installation),
so you may need to do some registry edits to get this to work.
- After installing the OS, install [SPICE Guest
Tools](https://www.spice-space.org/download.html) in the guest for better
display support, clipboard sharing, etc
  - This is probably less necessary when going for GPU passthrough, but I didn't
    know how far I was planning on going

## Setting up GPU passthrough with VFIO

This got me a nice Windows VM, but it was still far too slow for testing things
out in Skyrim, so I decided to continue setting up GPU passthrough. There were a
few guides that helped me through this process:

- [PCI passthrough via OVMF - ArchWiki](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF)
- [A GPU Passthrough Setup for NixOS (with VR passthrough too!)](https://astrid.tech/2022/09/22/0/nixos-gpu-vfio/)
- [Windows-on-NixOS, part 2: Make it go fast!](https://nixos.mayflower.consulting/blog/2020/06/17/windows-vm-performance/)
- [Notes on PCI Passthrough on NixOS using QEMU and VFIO](https://alexbakker.me/post/nixos-pci-passthrough-qemu-vfio.html)

My dedicated graphics card is an RX 580, and I have integrated graphics on my
i7-7700T. GPU passthrough is much easier if you have more than one graphics
card, because it's easiest give the VM full ownership of your passthrough GPU
rather than trying to share it between the guest and the host.

### Enabling IOMMU

GPU passthrough is done using VFIO, a Linux kernel driver that allows userspace
programs (like QEMU) access to PCI devices like a GPU. Giving the VM full access
would be insecure, however. To use VFIO, I first needed to enable IOMMU, which
ensures that passthrough devices operate within safe boundaries.

This was quick in NixOS:

```nix
boot.kernelParams = [ "intel_iommu=on" ];
```

If you have an AMD CPU, this will be `amd_iommu`.

After a rebuild and reboot, I could see that IOMMU was enabled using the
following command to check messages from the kernel:

```bash
sudo dmesg | grep -i iommu
```

```
[    0.000000] Command line: initrd=\EFI\nixos\l5q5mzranynx29kl5mfr9p9r6ljxjrmr-initrd-linux-6.12.18-initrd.efi init=/nix/store/c91cmpkrzsmai5kx426clw6mhfa2bfk5-nixos-system-lumine-25.05.20250309.e3e32b6/init intel_iommu=on loglevel=4
[    0.035515] Kernel command line: initrd=\EFI\nixos\l5q5mzranynx29kl5mfr9p9r6ljxjrmr-initrd-linux-6.12.18-initrd.efi init=/nix/store/c91cmpkrzsmai5kx426clw6mhfa2bfk5-nixos-system-lumine-25.05.20250309.e3e32b6/init intel_iommu=on loglevel=4
[    0.035553] DMAR: IOMMU enabled
[    0.260440] iommu: Default domain type: Translated
[    0.260443] iommu: DMA domain TLB invalidation policy: lazy mode
```

IOMMU puts PCI devices into groups. Everything in an IOMMU group must be passed
through as a unit. With IOMMU enabled, I needed to check the groups to make sure
my RX 580 wasn't grouped with anything else.

The Arch wiki includes a nice script for checking IOMMU groups:

```bash
#!/usr/bin/env bash
shopt -s nullglob
for g in $(find /sys/kernel/iommu_groups/* -maxdepth 0 -type d | sort -V); do
    echo "IOMMU Group ${g##*/}:"
    for d in $g/devices/*; do
        echo -e "\t$(lspci -nns ${d##*/})"
    done;
done;
```

But it wasn't returning anything!

```
IOMMU Group .:
```

It was because I needed to enable VT-d (Intel's IOMMU) in the BIOS. After doing
so, the output of each command looked better!

Kernel messages:

```
[    0.000000] Command line: initrd=\EFI\nixos\l5q5mzranynx29kl5mfr9p9r6ljxjrmr-initrd-linux-6.12.18-initrd.efi init=/nix/store/c91cmpkrzsmai5kx426clw6mhfa2bfk5-nixos-system-lumine-25.05.20250309.e3e32b6/init intel_iommu=on loglevel=4
[    0.035669] Kernel command line: initrd=\EFI\nixos\l5q5mzranynx29kl5mfr9p9r6ljxjrmr-initrd-linux-6.12.18-initrd.efi init=/nix/store/c91cmpkrzsmai5kx426clw6mhfa2bfk5-nixos-system-lumine-25.05.20250309.e3e32b6/init intel_iommu=on loglevel=4
[    0.035707] DMAR: IOMMU enabled
[    0.094223] DMAR-IR: IOAPIC id 2 under DRHD base  0xfed90000 IOMMU 0
[    0.259165] iommu: Default domain type: Translated
[    0.259167] iommu: DMA domain TLB invalidation policy: lazy mode
[    0.318990] pci 0000:00:00.0: Adding to iommu group 0
[    0.319003] pci 0000:00:01.0: Adding to iommu group 1
[    0.319012] pci 0000:00:08.0: Adding to iommu group 2
[    0.319026] pci 0000:00:14.0: Adding to iommu group 3
[    0.319033] pci 0000:00:14.2: Adding to iommu group 3
[    0.319044] pci 0000:00:16.0: Adding to iommu group 4
[    0.319053] pci 0000:00:17.0: Adding to iommu group 5
[    0.319064] pci 0000:00:1c.0: Adding to iommu group 6
[    0.319083] pci 0000:00:1f.0: Adding to iommu group 7
[    0.319091] pci 0000:00:1f.2: Adding to iommu group 7
[    0.319099] pci 0000:00:1f.3: Adding to iommu group 7
[    0.319109] pci 0000:00:1f.4: Adding to iommu group 7
[    0.319115] pci 0000:01:00.0: Adding to iommu group 1
[    0.319120] pci 0000:01:00.1: Adding to iommu group 1
[    0.319130] pci 0000:02:00.0: Adding to iommu group 8
```

IOMMU groups:

```
IOMMU Group 0:
	00:00.0 Host bridge [0600]: Intel Corporation Xeon E3-1200 v6/7th Gen Core Processor Host Bridge/DRAM Registers [8086:591f] (rev 05)
IOMMU Group 1:
	00:01.0 PCI bridge [0604]: Intel Corporation 6th-10th Gen Core Processor PCIe Controller (x16) [8086:1901] (rev 05)
	01:00.0 VGA compatible controller [0300]: Advanced Micro Devices, Inc. [AMD/ATI] Ellesmere [Radeon RX 470/480/570/570X/580/580X/590] [1002:67df] (rev e7)
	01:00.1 Audio device [0403]: Advanced Micro Devices, Inc. [AMD/ATI] Ellesmere HDMI Audio [Radeon RX 470/480 / 570/580/590] [1002:aaf0]
IOMMU Group 2:
	00:08.0 System peripheral [0880]: Intel Corporation Xeon E3-1200 v5/v6 / E3-1500 v5 / 6th/7th/8th Gen Core Processor Gaussian Mixture Model [8086:1911]
IOMMU Group 3:
	00:14.0 USB controller [0c03]: Intel Corporation 200 Series/Z370 Chipset Family USB 3.0 xHCI Controller [8086:a2af]
	00:14.2 Signal processing controller [1180]: Intel Corporation 200 Series PCH Thermal Subsystem [8086:a2b1]
IOMMU Group 4:
	00:16.0 Communication controller [0780]: Intel Corporation 200 Series PCH CSME HECI #1 [8086:a2ba]
IOMMU Group 5:
	00:17.0 SATA controller [0106]: Intel Corporation 200 Series PCH SATA controller [AHCI mode] [8086:a282]
IOMMU Group 6:
	00:1c.0 PCI bridge [0604]: Intel Corporation 200 Series PCH PCI Express Root Port #7 [8086:a296] (rev f0)
IOMMU Group 7:
	00:1f.0 ISA bridge [0601]: Intel Corporation 200 Series PCH LPC Controller (B250) [8086:a2c8]
	00:1f.2 Memory controller [0580]: Intel Corporation 200 Series/Z370 Chipset Family Power Management Controller [8086:a2a1]
	00:1f.3 Audio device [0403]: Intel Corporation 200 Series PCH HD Audio [8086:a2f0]
	00:1f.4 SMBus [0c05]: Intel Corporation 200 Series/Z370 Chipset Family SMBus Controller [8086:a2a3]
IOMMU Group 8:
	02:00.0 Ethernet controller [0200]: Realtek Semiconductor Co., Ltd. RTL8111/8168/8211/8411 PCI Express Gigabit Ethernet Controller [10ec:8168] (rev 15)
```

From this, I can see that IOMMU group that contains my RX 580:

```
IOMMU Group 1:
	00:01.0 PCI bridge [0604]: Intel Corporation 6th-10th Gen Core Processor PCIe Controller (x16) [8086:1901] (rev 05)
	01:00.0 VGA compatible controller [0300]: Advanced Micro Devices, Inc. [AMD/ATI] Ellesmere [Radeon RX 470/480/570/570X/580/580X/590] [1002:67df] (rev e7)
	01:00.1 Audio device [0403]: Advanced Micro Devices, Inc. [AMD/ATI] Ellesmere HDMI Audio [Radeon RX 470/480 / 570/580/590] [1002:aaf0]
```

But what's this? I expected two devices in this group - the graphics and the
audio - but there were three!

This is fine. Depending on motherboard and CPU, there are some cases where the
PCIe slot itself is shown in the group. This is okay, and I can still pass the
devices I need to VFIO. In this case, the script also shows the devices IDs that
I need to pass: `1002:67df` for graphics and `1002:aaf0` for audio.

### Passing the GPU through using VFIO

Now that I had verified that IOMMU was set up correctly and could see my IOMMU
groups, I could pass the GPU through using VFIO. Note that the VFIO modules are
loaded before regular graphics modules so that VFIO can bind to the card first.

```nix
{
  boot = {
    initrd.kernelModules = [
      "vfio_pci"
      "vfio"
      "vfio_iommu_type1"

      "i915"
      "amdgpu"
    ];

    kernelParams = [
      "intel_iommu=on"
      "vfio-pci.ids=1002:67df,1002:aaf0"
    ];
  };
}
```

I rebuilt the config, but before rebooting, I set up another monitor and plugged
it into my motherboard so that I could see my host through the iGPU. After VFIO
claims the dGPU, the host wouldn't be able to use it!

I rebooted... and the operating system was freezing during boot! Nothing was
showing up on my second monitor, either. Oops.

Thanks to NixOS, I could boot into a previous generation of the system and
debug! Eventually, I found that there was another BIOS setting which determined
if the motherboard should use the iGPU, dGPU, or both. It was currently set to
use the dGPU, so I changed it to use both.

This worked! I was able to see my host on my secondary monitor, and configure
virt-manager to pass my GPU through to the VM.

The VM had difficulty booting due to the hardware change, so I had to use the
virtual display to walk it through some restarts. After that, I installed AMD
drivers in the VM, and I could see Windows on my primary monitor! I suspect most
guides don't cover this part because they usually install the guest operating
system after passthrough is already set up.

To my surprise, sound was already working! Both the graphics and audio were
passed through, so the monitor was automatically used as my audio output. I keep
my speakers plugged into my monitor so that it's the audio output for whatever
the monitor is displaying (useful for switching between my desktop and work
laptop), so sound was working without any extra configuration!

## Final touches

virt-manager makes it easy to pass through USB devices. I was able to pass a
keyboard and Steam Controller through without issue. Both worked as expected with
no extra configuration - after installing Steam on the guest, I could use Steam
Controller shortcuts to open Big Picture mode, adjust audio, and navigate
through Steam.

The VM felt smooth, but was still struggling to launch Skyrim. Task Manager
reported that the VM was only seeing one logical processor, as I had used the
default CPU topology when I set everything up with virt-manager. My i7-7700T has
4 cores and 8 threads, so I gave the VM 2 cores and 4 threads.

## Result

This made everything incredibly smooth. I was able to open up Skyrim on my
ultrawide, playing fullscreen on my 3440x1440 monitor with a Steam Controller.
It felt native! I always think of VMs as slow because of my past experience with
them, so using a VM at near-native performance was incredible.

Here's the final config for my virtualization module:

```nix
{ pkgs, ... }:

{
  boot = {
    initrd.kernelModules = [
      "vfio_pci"
      "vfio"
      "vfio_iommu_type1"

      "i915"
      "amdgpu"
    ];

    kernelParams = [
      "intel_iommu=on"
      # RX 580 graphics and audio
      "vfio-pci.ids=1002:67df,1002:aaf0"
    ];
  };

  virtualisation = {
    libvirtd = {
      enable = true;
      qemu = {
        package = pkgs.qemu_kvm;
        ovmf.enable = true;
        swtpm.enable = true;
      };
    };
  };

  users.users.violet.extraGroups = [ "libvirtd" "kvm" ];
  environment.systemPackages = with pkgs; [
    virt-manager
    pciutils
  ];
}
```

## Keeping GPU passthrough disabled

For now, I've decided to disable GPU passthrough. I want to keep my host using
the dGPU where possible, but that gets complicated when VFIO steals it even when
I'm not using the VM. Also, enabling both the iGPU and dGPU is causing severe
visual issues in Hyprland, but I don't want my machine to only use the iGPU and
have the dGPU sitting there unused most of the time.

I'm sure I could figure these out with more time. For example, it looks like
there's already some prior art on [single GPU
passthrough](https://github.com/joeknock90/Single-GPU-Passthrough). but I need
to get some other work done :)

Temporary disabling this is also easy in NixOS! I just commented out the
relevant config and can uncomment it when I'm ready to continue working on it.
Here's my module for now.

```nix
{ pkgs, ... }:

{
  boot = {
    # initrd.kernelModules = [
    #   "vfio_pci"
    #   "vfio"
    #   "vfio_iommu_type1"
    #
    #   "i915"
    #   "amdgpu"
    # ];

    kernelParams = [
      "intel_iommu=on"
      # RX 580 graphics and audio
      # "vfio-pci.ids=1002:67df,1002:aaf0"
    ];
  };

  virtualisation = {
    libvirtd = {
      enable = true;
      qemu = {
        package = pkgs.qemu_kvm;
        ovmf.enable = true;
        swtpm.enable = true;
      };
    };
  };

  users.users.violet.extraGroups = [ "libvirtd" "kvm" ];
  environment.systemPackages = with pkgs; [
    virt-manager
    pciutils
  ];
}
```

## Conclusions

- Single GPU passthrough seems interesting
- [Looking Glass](https://looking-glass.io/) seems even more interesting
- NixOS is great! Having multiple generations of the system made it easy to
experiment safely, and being able to disable everything temporarily without
losing my progress for later is quite nice
- I need to take more pictures and screenshots during projects like this!
