"use hopscript"

const hh = require("hiphop");

function inputAndReact(val) {
   /* on trace, "IN(..) --> ..." is printed after traces embeded in
      the reactive program */
   console.log("IN(" + val + ") -->", m.inputAndReact("IN", val));
}

const prg =
      <hh.module IN=${{accessibility: hh.IN, combine: (a, b) => b}}
		 OUT1=${{initValue: "1|"}} OUT2=${{initValue: "2|"}}>
       <hh.loop>
	<hh.await immediate IN/>
	<hh.atom apply=${function() {console.log("   will trigger exec")}}/>
	<hh.trap trap>
	  <hh.parallel>
	    <hh.exec OUT1
		     apply=${function start_exec() {
			let timeout = 100;

			if (this.value.IN == "LONGWAIT")
			   timeout = timeout * 3;

			console.log("   exec started", timeout, this.value.IN);
			setTimeout(function(self,v) {
			   console.log("   exec returns", timeout, v);
			   self.return(v + "--|" + timeout);
			}, timeout, this, this.value.IN);
		     }}/>
	    <hh.exec OUT2
		     apply=${function start_exec() {
			let timeout = 200;

			if (this.value.IN == "LONGWAIT")
			   timeout = timeout * 3;

			console.log("   exec started", timeout, this.value.IN);
			setTimeout(function(self, v) {
			   console.log("   exec returns", timeout, v);
			   self.return(v + "--|" + timeout);
			}, timeout, this, this.value.IN);
		     }}/>
	    <hh.sequence>
	      <hh.await IN/>
	      <hh.atom apply=${function() {console.log("   will trap")}}/>
	      <hh.exit trap/>
	    </hh.sequence>
	  </hh.parallel>
	</hh.trap>
      </hh.loop>

    </hh.module>

var m = new hh.ReactiveMachine(prg);

/* TEST 1 */
setTimeout(function() {
   console.log("--- TEST 1 ---");
   console.log(m.react());
   inputAndReact("|");
   console.log(m.react());
   setTimeout(function() {console.log(m.react())}, 150);
   setTimeout(function() {console.log(m.react())}, 300);
}, 0)

/* TEST 2 */
setTimeout(function() {
   console.log("--- TEST 2 ---");
   inputAndReact("|");
   console.log(m.react());
   setTimeout(function() {console.log(m.react())}, 300);
   setTimeout(function() {console.log(m.react())}, 350);
}, 500)

/* TEST 3 */
setTimeout(function() {
   console.log("--- TEST 3 ---");
   inputAndReact("|1|");
   /* Only output signal with value |2|--... should be emitted */
   setTimeout(function() {inputAndReact("|2|")}, 50);
   setTimeout(function() {console.log(m.react())}, 120);
   setTimeout(function() {console.log(m.react())}, 350);
}, 1000)

/* TEST 4 */
setTimeout(function() {
   console.log("--- TEST 4 ---");
   /* This event will trigger exec that will be interrupted 50ms after.
      However, the exec return will be trigger *after* the second ones,
      but it is ignored (or the test failed) */
   inputAndReact("LONGWAIT");
   setTimeout(function() {inputAndReact("|2|")}, 50);
   setTimeout(function() {console.log(m.react())}, 2000);
}, 1500)
