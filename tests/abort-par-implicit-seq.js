"use hopscript"

var hh = require("hiphop");

var prg = <hh.module>
  <hh.inputsignal name="I"/>
  <hh.outputsignal name="O"/>
  <hh.let>
    <hh.signal name="L"/>
    <hh.parallel>
      <hh.abort signal="L">
	<hh.loop>
	  <hh.emit signal="O"/>
	  <hh.pause/>
	</hh.loop>
      </hh.abort>
      <hh.sequence>
	<hh.await signal="I"/>
	<hh.emit signal="L"/>
      </hh.sequence>
    </hh.parallel>
  </hh.let>
</hh.module>;

exports.prg = new hh.ReactiveMachine(prg, "abortpar");
