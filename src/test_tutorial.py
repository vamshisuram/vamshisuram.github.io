#!/usr/bin/env python

# Filename       : moose.py 
# Created on     : 2013-10-19
# Author         : Dilawar Singh
# Email          : dilawars@ncbs.res.in
#
# Description    : This is small tutorial on moose.
#
# Logs           :

import sys
sys.path.append("/home2/dilawar/Work/NCBS/moose-code/moose/branches/buildQ/python/")
import moose 
from IPython import embed 

def initModel() :
  global model, soma, pulse
  model = moose.Neutral('/model')
  soma = moose.Compartment('/model/soma')
  pulse = moose.PulseGen('/model/pulse')

def setupDataStorage() :
  global data, vmtab
  data = moose.Neutral('/data')
  vmtab = moose.Table('/data/soma_Vm')

def setParameters() :
  soma.Cm = 1e-9
  soma.Rm = 1e7
  soma.initVm = -0.07 

def setPulses() :
  pulse.delay[0] = 50e-3
  pulse.width[0] = 100e-3
  pulse.level[0] = 1e-9
  pulse.delay[1] = 1e9

def setConnection() :
  m = moose.connect(pulse , 'outputOut' , soma , 'injectMsg')
  moose.connect(vmtab , 'requestData' , soma , 'get_Vm')

def setSchedule() :
  # Set clocks with various pulse rate.
  moose.setClock(0, 0.025e-3)
  moose.setClock(1, 0.025e-3)
  moose.setClock(2, 0.25e-3)

  # Use clock #2 on /data/soma_Vm and call 'process' method at each tick.
  moose.useClock(2, '/data/soma_Vm', 'process')
  # Update soma values on events on clock #2
  moose.useClock(0, soma.path, 'init')
  # Update everything else in clock #1
  moose.useClock(1, '/model/##', 'process')

  # reinitialize everything.
  moose.reinit()

def run( plot = False) :
  moose.start(300e-3)
  if plot :
    import pylab
    t = pylab.linspace(0, 300e-3, len(vmtab.vec))
    pylab.plot(t, vmtab.vec)
    pylab.show()

if __name__ == "__main__" :
  initModel()
  setupDataStorage()
  setParameters()
  setPulses()
  setConnection()
  setSchedule()
  run(plot=True)
