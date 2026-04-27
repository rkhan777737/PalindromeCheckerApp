import org.junit.Assert;
import org.junit.Test;

public class QuantityMeasurementAppTest {
    @Test
    public void givenTwoSameFeetValues_WhenCompared_ShouldReturnTrue() {
        QuantityMeasurementApp.Feet feet1 = new QuantityMeasurementApp.Feet(1.0);
        QuantityMeasurementApp.Feet feet2 = new QuantityMeasurementApp.Feet(1.0);
        Assert.assertEquals(feet1, feet2);
    }
    // ... add other tests here
}
